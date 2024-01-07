import type { StepInputs } from '..';
import * as path from "path";
import * as fs from "fs";

export const name = "include";

// Fix code blocks
export function fn({ $, asset }: StepInputs): void {
    $('include').each((i, el) => {
        const src = $(el).attr('src');
        const pre = $(el).attr('pre');

        const attrs = $(el).attr() ?? {};

        const abssrc = src!.replace(
            './',
            `${path.dirname(asset.filePath)}${path.sep}`,
        );

        asset.invalidateOnFileChange(abssrc);

        let content = fs.readFileSync(abssrc, 'utf8');

        const replacement = $(
            (pre && pre !== 'false')
                ? `<pre>${content.replace('\n', '<br/>')}</pre>`
                : `<div>${content}</div>`
        );
        $(replacement).attr(attrs);

        $(el).replaceWith(replacement);

    });
}
