import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export type QuickLink = {
  title: string;
  highlight?: string; // colored first word like "Feeds:" or "Landing page:"
  description?: string;
  href: string;
  badge?: 'NEW' | string;
};

const items: QuickLink[] = [
  {
    highlight: 'Feeds:',
    title: 'Where your community thrives',
    href: '#',
    badge: 'NEW',
  },
  {
    title: 'Customer community platform',
    description: 'to engage customers',
    href: '#',
  },
  {
    highlight: 'Landing page:',
    title: 'Welcome the right people',
    href: '#',
  },
  {
    title: 'The enterprise‑grade',
    description: 'B2B community platform',
    href: '#',
  },
];

const colorize = (text: string) => (
  <>
    {text.split(' ').map((word, i) => {
      const map: Record<number, string> = {
        0: 'text-violet-600',
        1: 'text-purple-600',
        2: 'text-red-500',
      };
      return (
        <span key={i} className={map[i] || 'text-gray-900'}>
          {word}{' '}
        </span>
      );
    })}
  </>
);

export const CommunityQuickLinks: React.FC<{ links?: QuickLink[] }> = ({ links = items }) => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {links.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group relative rounded-2xl bg-gray-100 p-6 focus:outline-none focus:ring-2 focus:ring-blue-600"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              {/* NEW badge */}
              {item.badge && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-300 text-gray-900 px-2 py-1 rounded-md shadow-sm">
                  {item.badge}
                </span>
              )}

              <div className="mt-2 pr-10">
                {item.highlight && (
                  <span className="font-semibold text-lg text-violet-600 mr-1">
                    {item.highlight}
                  </span>
                )}
                <h3 className="inline text-xl font-bold leading-snug text-gray-900">
                  {item.description ? (
                    <>
                      {colorize(item.title)}
                      <span className="ml-1">{colorize(item.description)}</span>
                    </>
                  ) : (
                    colorize(item.title)
                  )}
                </h3>
              </div>

              {/* Arrow circle */}
              <div className="absolute right-4 top-4">
                <div className="grid place-items-center w-9 h-9 rounded-full bg-white shadow-sm group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                  <ArrowUpRight className="w-5 h-5 text-gray-900" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityQuickLinks;
