/* teste temporário dos ajudantes */
'use strict';
{
  def('natureza', 'vivo', {
    t: 'Galeria', s: 'teste', c: '#D8C08A', loc: 'teste', d: '<p>teste</p>', enem: 'teste',
    draw(t, S) {
      const A = area(), u = Math.min(A.w / 6, A.h / 3);
      virion(A.x0 + u * .6, A.y0 + u * .6, u * .4, { tipo: 'gripe', rot: t * .2, ph: t, corte: (Math.sin(t) + 1) / 2 });
      virion(A.x0 + u * 1.7, A.y0 + u * .6, u * .4, { tipo: 'corona', rot: t * .2, corte: 1 });
      virion(A.x0 + u * 2.8, A.y0 + u * .6, u * .4, { tipo: 'hiv', corte: 1, enz: true });
      virion(A.x0 + u * 3.9, A.y0 + u * .6, u * .4, { tipo: 'herpes', corte: 1, rot: t * .3 });
      virion(A.x0 + u * 5, A.y0 + u * .6, u * .35, { tipo: 'nu', rot: t * .3, fibras: true });
      icosa(A.x0 + u * .6, A.y0 + u * 1.7, u * .4, { ry: t * .5, hl: Math.floor(t) % 21 });
      helice(A.x0 + u * 1.2, A.y0 + u * 1.7, A.x0 + u * 3, A.y0 + u * 1.7, u * .14, { ph: t, corte: .25 });
      fago(A.x0 + u * 3.6, A.y0 + u * 2.2, u * .9, { contrai: (Math.sin(t) + 1) / 2, dna: (Math.cos(t) + 1) / 2 });
      bacteriaCorte(A.x0 + u * 5, A.y0 + u * 1.7, u * 1.2, u * .55, { ins: { f: .2, len: .15, k: fr(t * .3) }, lise: 0 });
      const c = celula(A.x0 + u * 1, A.y0 + u * 2.6, u * .8, u * .35, { rec: { n: 5, tipo: 'CD4', de: -2.5, ate: -.6 } });
      receptor(A.x0 + u * 2.4, A.y0 + u * 2.6, -PI / 2, 'ECA2'); receptor(A.x0 + u * 2.7, A.y0 + u * 2.6, -PI / 2, 'sial');
      espicula(A.x0 + u * 2.4, A.y0 + u * 2.9, -PI / 2, 16, { tipo: 'S' }); espicula(A.x0 + u * 2.7, A.y0 + u * 2.9, -PI / 2, 16, { tipo: 'H' }); espicula(A.x0 + u * 3, A.y0 + u * 2.9, -PI / 2, 16, { tipo: 'N' }); espicula(A.x0 + u * 3.3, A.y0 + u * 2.9, -PI / 2, 16, { tipo: 'gp' });
      fita([[A.x0 + u * 4.2, A.y0 + u * 2.5], [A.x0 + u * 5.8, A.y0 + u * 2.5]], { tipo: 'dna', ph: t * 3 });
      fita([[A.x0 + u * 4.2, A.y0 + u * 2.8], [A.x0 + u * 5.8, A.y0 + u * 2.8]], { ph: t * 3, f: fr(t * .3) });
      anticorpo(A.x0 + u * 3.6, A.y0 + u * 2.7, -PI / 2, 24); envelope(A.x0 + u * 3.9, A.y0 + u * 1.2, u * .2, { desfaz: fr(t * .3), esp: 8 });
      bicho('mosquito', A.x0 + u * 4.4, A.y0 + u * 1.15, 40); bicho('macaco', A.x0 + u * 4.4, A.y0 + u * 1.55, 40); bicho('porco', A.x0 + u * 4.4, A.y0 + u * 1.95, 40);
      regua(A.x0 + 20, A.y1 - 10, 80, '300 nm');
    }
  });
}
