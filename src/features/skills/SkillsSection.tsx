import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { portfolioData } from '../../data/portfolio';
import { SectionHeading } from '../../components/common/SectionHeading';
import { GlassCard } from '../../components/common/GlassCard';

export const SkillsSection = () => {
  const { t } = useTranslation();
  const { skills } = portfolioData;

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-800/50">
      <SectionHeading highlight={t('sections.skillsHighlight')}>
        {t('sections.skills')}
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(skills).map(([category, categorySkills], index) => (
          <motion.div 
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-6 h-full">
              <h3 className="text-xl font-bold mb-6 capitalize text-neon-cyan">{category}</h3>
              <div className="flex flex-col gap-3">
                {categorySkills.map((skill: string) => (
                  <div key={skill} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-purple" />
                    <span className="text-slate-300">{skill}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
