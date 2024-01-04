import type { StepInputs } from '..';

export const name = 'optimize-images';

export function fn({ $, asset }: StepInputs): void {
  $('img:not(picture > img)').each((_, el) => {
    const url = $(el).attr('src');
    if (!url) {
      return;
    }
    const dep = asset.getDependencies().find((dep) => dep.id === url);
    if (!dep || dep.specifier.endsWith('.svg')) {
      return;
    }
    const as = (format: string) =>
      asset.addURLDependency(`${dep.specifier}?as=${format}`, {});

    $(el).wrap('<picture></picture>');
    $(`<source srcset="${as('avif')}" type="image/avif">`).insertBefore(el);
    $(`<source srcset="${as('webp')}" type="image/webp">`).insertBefore(el);
  });
}
