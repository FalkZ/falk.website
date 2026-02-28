import ijwConfig from "ijw/prettier";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    ...ijwConfig,
    htmlWhitespaceSensitivity: "strict",
};

export default config;
