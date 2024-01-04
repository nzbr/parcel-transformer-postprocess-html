import * as path from 'path';
import type { StepInputs } from '..';
import { toPosixPath } from '..';

const indexExtensions = ['html', 'hbs', 'md'];

// Remove index.* from links
export function removeIndex({ $, asset, options }: StepInputs): void {
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) {
      return;
    }
    const dep = asset.getDependencies().find((dep) => dep.id === href);
    if (!dep || dep.specifier.includes(':')) {
      return;
    }
    for (const ext of indexExtensions) {
      if (dep.specifier.endsWith(`index.${ext}`)) {
        $(el).attr(
          'href',
          '/' +
            path.posix.relative(
              path.posix.join(toPosixPath(options.projectRoot), 'src'),
              path.posix.join(
                toPosixPath(path.dirname(asset.filePath)),
                path.posix.dirname(dep.specifier),
              ),
            ),
        );
        return;
      }
    }
  });
}
