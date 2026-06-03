import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlassCard } from '../GlassCard';

describe('GlassCard Component', () => {
  it('debe renderizar el contenido correctamente', () => {
    render(<GlassCard>Contenido de prueba</GlassCard>);
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
  });

  it('debe aplicar las clases CSS por defecto y las enviadas por props', () => {
    const { container } = render(<GlassCard className="mi-clase-personalizada">Hola</GlassCard>);
    const element = container.firstChild as HTMLElement;
    
    expect(element.className).toContain('glass-panel');
    expect(element.className).toContain('mi-clase-personalizada');
  });
});
