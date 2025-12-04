import ijwConfig from "ijw/prettier";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    ...ijwConfig,
    overrides: [
        ...ijwConfig.overrides,
        {
            files: "*.svx",
            options: {
                parser: "markdown",
            },
        },
    ],
};

export default config;
