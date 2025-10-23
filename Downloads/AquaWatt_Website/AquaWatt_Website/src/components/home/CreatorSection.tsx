import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, User, Users, Code, Award, Target, Zap, ChevronRight, Github, Linkedin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export const CreatorSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const achievements = [
    { icon: Code, value: "25+", label: "Projects Completed", color: "from-blue-500 to-cyan-500" },
    { icon: Award, value: "3+", label: "Years Experience", color: "from-emerald-500 to-green-500" },
    { icon: Target, value: "86%", label: "Client Satisfaction", color: "from-purple-500 to-pink-500" },
    { icon: Zap, value: "24/7", label: "Innovation Drive", color: "from-amber-500 to-orange-500" }
  ];



  return (
    <section aria-labelledby="creator-heading" className="relative py-12 md:py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/50" />
      
      {/* Floating Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Meet the Creator</span>
            </div>
            <h2 id="creator-heading" className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
              About the Creator
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A brief introduction about the creator and the work behind AquaWatt.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column - Profile & Contact */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10" />
                <CardContent className="relative p-8">
                  {/* Profile Photo */}
                  <div className="flex justify-center mb-8">
                    <motion.div 
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 p-1 shadow-2xl">
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 p-2">
                          <Avatar className="w-full h-full border-4 border-white dark:border-gray-700">
                            <AvatarImage 
                              src="/creator-photo.png" 
                              alt="Dinesh M"
                              className="object-cover"
                            />
                            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                              DM
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      {/* Status Indicator */}
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Name & Title */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Dinesh M
                    </h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-medium mb-2">
                      Web Developer  |  AquaWatt
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Chennai, Tamil Nadu, India
                    </p>
                  </div>



                  {/* Contact Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open('https://github.com/dineshit27', '_blank')}
                    >
                      <Github className="h-4 w-4 mr-1" />
                      GitHub
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open('https://www.linkedin.com/in/m-dinesh-d30/', '_blank')}
                    >
                      <Linkedin className="h-4 w-4 mr-1" />
                      LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div variants={itemVariants} className="lg:col-span-8 space-y-8">
              
              {/* Achievements Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="group"
                  >
                    <Card className="relative overflow-hidden border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                          <achievement.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {achievement.value}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          {achievement.label}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>



              {/* Portfolio CTA */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 text-white overflow-hidden">
                  <CardContent className="p-8 text-center relative">
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
                      <div className="absolute top-4 left-4 w-2 h-2 bg-white/20 rounded-full" />
                      <div className="absolute top-8 right-8 w-1 h-1 bg-white/30 rounded-full" />
                      <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white/25 rounded-full" />
                      <div className="absolute bottom-4 right-4 w-1 h-1 bg-white/20 rounded-full" />
                    </div>
                    <div className="relative">
                      <h3 className="text-2xl font-bold mb-2">Ready to collaborate?</h3>
                      <p className="text-blue-100 mb-6">
                        Let's build something amazing together. Check out my portfolio for more projects and get in touch!
                      </p>
                      <Button 
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                        onClick={() => window.open('https://m-dinesh-30.web.app/', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Portfolio
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CreatorSection;
