import {Transformer} from '@parcel/plugin';
import type {Async, MutableAsset, PluginLogger, PluginOptions} from '@parcel/types';
import * as cheerio from 'cheerio/lib/slim'; // use slim because parse5 doesn't like the input
import * as path from 'path';
import type {CheerioAPI} from 'cheerio';

export type StepInputs = {
    $: CheerioAPI;
    asset: MutableAsset;
    options: PluginOptions;
    logger: PluginLogger;
    config: { [key: string]: any };
};

export type PostprocessorPlugin = {
    name: string;
    fn: (inputs: StepInputs) => Async<void>;
};

export type PostprocessorConfig = {
    plugins: PostprocessorPlugin[];
    config: { [key: string]: { [key: string]: any } };
}

export const toPosixPath = (p: string) => p.split(path.sep).join(path.posix.sep);

export default new Transformer<{}>({
    async transform({asset, options, logger}) {
        const configPath = path.join(options.projectRoot, 'postprocessor.config.js');
        asset.invalidateOnFileChange(configPath);

        const config = await (await import(configPath)).default as PostprocessorConfig;

        let code = await asset.getCode();

        // remove BOM if present
        if (code.charCodeAt(0) === 0xfeff) {
            code = code.slice(1);
        }

        const $ = cheerio.load(code);

        for (const plugin of config.plugins) {
            await plugin.fn({
                $,
                asset,
                options,
                logger,
                config: config.config[plugin.name] ?? {}
            });
        }

        asset.setCode($.html());

        return [asset];
    },

});
