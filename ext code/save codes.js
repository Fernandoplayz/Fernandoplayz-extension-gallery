(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = [];

    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!");
        return;
    }

    class Extension {
        getInfo() {
            return {
                id: "save",
                name: "save codes",
                color1: "#0088ff",
                color2: "#0063ba",
                blockIconURI: "https://raw.githubusercontent.com/Fernandoplayz/Fernandoplayz-extension-gallery/main/ext%20icons/image_2024-06-07_204646397%20(2).svg",
                docsURI: "https://savecodes-doc.vercel.app", // Documentation URL
                blocks: blocks
            };
        }
    }

    blocks.push({
        opcode: "reset",
        blockType: Scratch.BlockType.COMMAND,
        text: "reset savecode",
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });

    Extension.prototype["reset"] = (args, util) => {
        variables["savecode"] = "";
        variables["readIndex"] = 0;
        variables["readParts"] = [];
    };

    blocks.push({
        opcode: "setsave",
        blockType: Scratch.BlockType.COMMAND,
        text: "set SaveCode to [set]",
        isEdgeActivated: false,
        arguments: {
            set: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "chicken|butt|"
            }
        },
        disableMonitor: true
    });

    Extension.prototype["setsave"] = (args, util) => {
        variables["savecode"] = args["set"];
        variables["readIndex"] = 0;
        variables["readParts"] = splitSaveCode(variables["savecode"]);
    };

    blocks.push({
        opcode: "write",
        blockType: Scratch.BlockType.COMMAND,
        text: "write value [text]",
        isEdgeActivated: false,
        arguments: {
            text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "chicken"
            }
        },
        disableMonitor: true
    });

    Extension.prototype["write"] = (args, util) => {
        let text = args["text"];
        text = text.replace(/([|\\])/g, "\\$1"); // Escape | and \ characters
        if (!variables["savecode"]) {
            variables["savecode"] = "";
        }
        variables["savecode"] += text + "|";
        variables["readParts"] = splitSaveCode(variables["savecode"]);
    };

    blocks.push({
        opcode: "getsave",
        blockType: Scratch.BlockType.REPORTER,
        text: "Get SaveCode",
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });

    Extension.prototype["getsave"] = (args, util) => {
        return variables["savecode"] || "";
    };

    blocks.push({
        opcode: "pre",
        blockType: Scratch.BlockType.COMMAND,
        text: "prepare to read",
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });

    Extension.prototype["pre"] = (args, util) => {
        variables["readIndex"] = 0;
        variables["readParts"] = variables["savecode"] ? splitSaveCode(variables["savecode"]) : [];
    };

    blocks.push({
        opcode: "return",
        blockType: Scratch.BlockType.REPORTER,
        text: "return read value",
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });

    Extension.prototype["return"] = (args, util) => {
        const index = variables["readIndex"] || 0;
        const parts = variables["readParts"] || [];
        if (index >= parts.length) {
            return "";
        }
        const value = parts[index];
        variables["readIndex"] = index + 1;
        return value;
    };

    function splitSaveCode(savecode) {
        const parts = [];
        let part = "";
        let escaping = false;
        for (let i = 0; i < savecode.length; i++) {
            const char = savecode[i];
            if (escaping) {
                part += char;
                escaping = false;
            } else if (char === "\\") {
                escaping = true;
            } else if (char === "|") {
                parts.push(part);
                part = "";
            } else {
                part += char;
            }
        }
        return parts;
    }

    Scratch.extensions.register(new Extension());
})(Scratch);
