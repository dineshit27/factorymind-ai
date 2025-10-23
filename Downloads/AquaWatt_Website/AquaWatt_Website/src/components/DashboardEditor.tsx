import React, { useState, useCallback, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ScatterChart, Scatter
} from 'recharts';
import {
  Plus, Edit3, Trash2, Move, Grid3X3, Save, Undo, Eye, EyeOff,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  ScatterChart as ScatterChartIcon, TrendingUp, Activity,
  Layers, Zap, Droplets
} from 'lucide-react';

export type ChartType = 
  | 'bar' | 'line' | 'area' | 'pie' | 'scatter'
  | 'stacked-bar' | 'histogram';

export interface ChartWidget {
  id: string;
  title: string;
  type: ChartType;
  dataSource: string;
  config: {
    width: number;
    height: number;
    colors: string[];
    showLegend: boolean;
    showTooltip: boolean;
    showGrid: boolean;
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
}

interface DashboardEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (widgets: ChartWidget[]) => void;
  initialWidgets?: ChartWidget[];
}

const chartTypeIcons = {
  bar: BarChart3,
  line: LineChartIcon,
  area: TrendingUp,
  pie: PieChartIcon,
  scatter: ScatterChartIcon,
  'stacked-bar': Layers,
  histogram: Activity,
};

const defaultColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface MonthlyDatum { name: string; water: number; electricity: number; cost: number }
interface DistributionDatum { name: string; value: number; efficiency: number }
interface HourlyDatum { hour: number; water: number; electricity: number; temperature: number }

const sampleData: {
  monthly: MonthlyDatum[];
  distribution: DistributionDatum[];
  hourly: HourlyDatum[];
} = {
  monthly: [
    { name: 'Jan', water: 320, electricity: 240, cost: 85 },
    { name: 'Feb', water: 300, electricity: 220, cost: 78 },
    { name: 'Mar', water: 340, electricity: 280, cost: 92 },
    { name: 'Apr', water: 280, electricity: 200, cost: 68 },
    { name: 'May', water: 290, electricity: 210, cost: 72 },
    { name: 'Jun', water: 350, electricity: 260, cost: 89 },
  ],
  distribution: [
    { name: 'Kitchen', value: 35, efficiency: 0.8 },
    { name: 'Bathroom', value: 25, efficiency: 0.7 },
    { name: 'Garden', value: 20, efficiency: 0.9 },
    { name: 'Laundry', value: 15, efficiency: 0.6 },
    { name: 'Other', value: 5, efficiency: 0.5 },
  ],
  hourly: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    water: Math.random() * 50 + 20,
    electricity: Math.random() * 40 + 15,
    temperature: Math.random() * 10 + 20,
  })),
};

const DashboardEditor: React.FC<DashboardEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialWidgets = []
}) => {
  const [widgets, setWidgets] = useState<ChartWidget[]>(initialWidgets);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  const isMobile = useIsMobile();

  // Disallow any legacy types like 'bubble' or 'density' if present in initial state
  useEffect(() => {
  const allowed: ChartType[] = ['bar','line','area','pie','scatter','stacked-bar','histogram'];
    setWidgets(prev => prev.filter(w => (allowed as string[]).includes(w.type)));
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createWidget = useCallback((type: ChartType): ChartWidget => ({
    id: generateId(),
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
    type,
    dataSource: 'monthly',
    config: {
      width: 400,
      height: 300,
      colors: defaultColors,
      showLegend: true,
      showTooltip: true,
      showGrid: true,
    },
    position: { x: 0, y: 0 },
    size: { width: 2, height: 2 },
    visible: true,
  }), []);

  const addWidget = (type: ChartType) => {
    // Prevent adding the same chart type more than once
    if (widgets.some(w => w.type === type)) {
      toast({
        title: "Already added",
        description: `The ${type.replace('-', ' ')} widget is already in your dashboard.`,
        variant: 'destructive'
      });
      return;
    }
    const newWidget = createWidget(type);
    setWidgets(prev => [...prev, newWidget]);
    setIsAddingWidget(false);
    toast({
      title: "Widget Added",
      description: `${type} chart widget has been added to your dashboard.`,
    });
  };

  const updateWidget = (id: string, updates: Partial<ChartWidget>) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    if (selectedWidget === id) setSelectedWidget(null);
    toast({
      title: "Widget Removed",
      description: "Chart widget has been removed from your dashboard.",
    });
  };

  const toggleWidgetVisibility = (id: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === id ? { ...w, visible: !w.visible } : w
    ));
  };

  const handleSave = () => {
    onSave(widgets);
    onClose();
    toast({
      title: "Dashboard Saved",
      description: "Your dashboard configuration has been saved successfully.",
    });
  };

  const renderChart = (widget: ChartWidget) => {
    const data = sampleData[widget.dataSource as keyof typeof sampleData];
    const { config } = widget;

    switch (widget.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <BarChart data={data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              <Bar dataKey="water" fill={config.colors[0]} />
              <Bar dataKey="electricity" fill={config.colors[1]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <LineChart data={data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              <Line type="monotone" dataKey="water" stroke={config.colors[0]} />
              <Line type="monotone" dataKey="electricity" stroke={config.colors[1]} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <AreaChart data={data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              <Area type="monotone" dataKey="water" stackId="1" stroke={config.colors[0]} fill={config.colors[0]} />
              <Area type="monotone" dataKey="electricity" stackId="1" stroke={config.colors[1]} fill={config.colors[1]} />
            </AreaChart>
          </ResponsiveContainer>
        );

  case 'pie': {
        const arr = Array.isArray(data) ? (data as (DistributionDatum | MonthlyDatum)[]) : [];
        const pieKey: 'value' | 'water' = arr.length && Object.prototype.hasOwnProperty.call(arr[0], 'value') ? 'value' : 'water';
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <PieChart>
              <Pie
                data={arr}
                cx="50%"
                cy="50%"
        outerRadius={Math.max(50, Math.min(isMobile ? 80 : 120, config.height / 2 - 20))}
                dataKey={pieKey}
        label={isMobile ? false : (({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`)}
        labelLine={!isMobile}
              >
                {arr.map((_, index: number) => (
                  <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
                ))}
              </Pie>
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );
      }

      case 'scatter': {
        const arr = Array.isArray(data) ? (data as MonthlyDatum[] | DistributionDatum[] | HourlyDatum[]) : [];
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <ScatterChart>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis type="number" dataKey="water" name="Water" />
              <YAxis type="number" dataKey="electricity" name="Electricity" />
              {config.showTooltip && <Tooltip cursor={{ strokeDasharray: '3 3' }} />}
              {config.showLegend && <Legend />}
              <Scatter name="Usage" data={arr} fill={config.colors[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      }


      case 'stacked-bar':
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <BarChart data={data}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" />
              <YAxis />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              <Bar dataKey="water" stackId="a" fill={config.colors[0]} />
              <Bar dataKey="electricity" stackId="a" fill={config.colors[1]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'histogram': {
        const histogramData = sampleData.hourly.map((d, i) => ({
          bin: `${i * 2}-${(i + 1) * 2}h`,
          frequency: Math.max(1, Math.floor(d.water / 10))
        }));
        return (
          <ResponsiveContainer width="100%" height={config.height}>
            <BarChart data={histogramData}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="bin" />
              <YAxis />
              {config.showTooltip && <Tooltip />}
              <Bar dataKey="frequency" fill={config.colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      }

      // heatmap removed


      default:
        return <div className="flex items-center justify-center h-32 text-muted-foreground">Chart preview not available</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] sm:w-[90vw] lg:w-[80vw] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            Dashboard Editor
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-4 h-[70vh] lg:h-[75vh] px-1">
          {/* Widget Library */}
          <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 pr-0 lg:pr-4">
            <div className="space-y-4">
              <Button
                onClick={() => setIsAddingWidget(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
              </Button>

              <ScrollArea className="h-[240px] lg:h-[500px]">
                <div className="space-y-2">
                  {widgets.map((widget) => (
                    <Card
                      key={widget.id}
                      className={`cursor-pointer transition-colors ${
                        selectedWidget === widget.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedWidget(widget.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {React.createElement(chartTypeIcons[widget.type], { className: "h-4 w-4" })}
                            <span className="text-sm font-medium truncate">
                              {widget.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWidgetVisibility(widget.id);
                              }}
                            >
                              {widget.visible ? (
                                <Eye className="h-3 w-3" />
                              ) : (
                                <EyeOff className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeWidget(widget.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {widget.type}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 border border-dashed border-border rounded-lg p-4 overflow-auto min-h-[300px]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 min-h-full">
              {widgets.filter(w => w.visible).map((widget) => (
                <Card
                  key={widget.id}
                  className={`transition-all ${
                    selectedWidget === widget.id ? 'ring-2 ring-primary shadow-lg' : ''
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{widget.title}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedWidget(widget.id)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWidget(widget.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {renderChart(widget)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Properties Panel */}
          {selectedWidget && (
            <div className="hidden lg:block w-64 border-l border-border pl-4">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <h3 className="font-semibold">Widget Properties</h3>
                  
                  {(() => {
                    const widget = widgets.find(w => w.id === selectedWidget);
                    if (!widget) return null;

                    return (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={widget.title}
                            onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="dataSource">Data Source</Label>
                          <Select
                            value={widget.dataSource}
                            onValueChange={(value) => updateWidget(widget.id, { dataSource: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly Data</SelectItem>
                              <SelectItem value="distribution">Distribution</SelectItem>
                              <SelectItem value="hourly">Hourly Data</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="height">Chart Height</Label>
                          <Input
                            id="height"
                            type="number"
                            value={widget.config.height}
                            onChange={(e) => updateWidget(widget.id, {
                              config: { ...widget.config, height: parseInt(e.target.value) }
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Chart Options</Label>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={widget.config.showLegend}
                                onChange={(e) => updateWidget(widget.id, {
                                  config: { ...widget.config, showLegend: e.target.checked }
                                })}
                              />
                              <span className="text-sm">Show Legend</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={widget.config.showTooltip}
                                onChange={(e) => updateWidget(widget.id, {
                                  config: { ...widget.config, showTooltip: e.target.checked }
                                })}
                              />
                              <span className="text-sm">Show Tooltip</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={widget.config.showGrid}
                                onChange={(e) => updateWidget(widget.id, {
                                  config: { ...widget.config, showGrid: e.target.checked }
                                })}
                              />
                              <span className="text-sm">Show Grid</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Add Widget Dialog */}
        <Dialog open={isAddingWidget} onOpenChange={setIsAddingWidget}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Widget</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-4">
              {Object.entries(chartTypeIcons).map(([type, Icon]) => {
                const disabled = widgets.some(w => w.type === (type as ChartType));
                return (
                  <Button
                    key={type}
                    variant={disabled ? "secondary" : "outline"}
                    className="h-20 flex-col gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => addWidget(type as ChartType)}
                    disabled={disabled}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs capitalize">
                      {type.replace('-', ' ')}{disabled ? ' (added)' : ''}
                    </span>
                  </Button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* Footer Actions */}
        <div className="sticky bottom-0 left-0 right-0 bg-background mt-2 px-4 py-3 border-t rounded-b-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center gap-2 order-2 sm:order-1">
            <Button variant="outline" onClick={() => setWidgets([])} className="w-full sm:w-auto">
              <Undo className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="flex gap-2 order-1 sm:order-2">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" />
              Save Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardEditor;
