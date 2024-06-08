(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = [];

    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return;
    }

    class Extension {
        getInfo() {
            return {
                "id": "save",
                "name": "save codes",
                "color1": "#0088ff",
                "color2": "#0063ba",
                "tbShow": true,
                "blocks": blocks,
                "blockIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI0NSIgaGVpZ2h0PSI0MyIgdmlld0JveD0iMCwwLDQ1LDQzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIxLjUsLTE2NC41KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48aW1hZ2UgeD0iNDQzIiB5PSIzMjkiIHRyYW5zZm9ybT0ic2NhbGUoMC41LDAuNSkiIHdpZHRoPSI5MCIgaGVpZ2h0PSI4NiIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFGb0FBQUJXQ0FZQUFBQlBhb0Y1QUFBQUFYTlNSMElBcnM0YzZRQUFDMmxKUkVGVWVGN3RYZnRUMjFZV3RtUmJ0aVUvTVdBRGFRamxFU0FoM1hiNzNKbjlxOXZwVCtsMlo3ZFRkaE1JU1NDVHBHU2FFRUxJQzR3ZmtoK1M3UTczTzBjZXVYRk44R09BWFAveWNZMHN5NSsrZSs2NTU1NTdwUGc2dks3T2ZOMDgvcGVxK3NVUmlrL0ZrWXBDYlRTYmpZWVgyODZuMFBGK1B6N1BxSVUxMFE2RmdLcUs4eDUvVTI4dmNkbStSZ1BZYkxZaHZVK1g1Vk5WWEJlTzh2bktWc1dEN3VmcGlDWWZTZWY5YldmdFJCZmM4U0JKTkFnZk9OSFg1djhwYm5JNFpJZ3ZEUGhEMEpzQ0JTaE4zQ09uVmlXc2tTWllHMmdHQXVnUjRRZytyMGNqQXJPVG84Q3BNWUdhQm1XN2dtYkowVmxQQ3R6RGJOdWg2eUowQ09sOXZ4L1hGYUtlVmEralorNzh2aWZ3K1ZOZ3piRUYxcHQxUXB5bjBRQStmbmFyTjBWTG9nZE05UHowbDBLU2hwRVNkeXhxcEhIbmc3cEF2eEtFOEVqUlZhdUVPMitaQXB0TktJTmZySmg0TWlyZVNxVVRBaGRYWmoyb0cxQTYyM1JHejhsTzBLZzdVRjY1aks1ZkladGJyYURuVlN2b2VVRU52eU1hUTQvbHo2MnQzaGZ0OWRWTmdWYXRMTkQyVVk5bzRQTk9IZWQ3K1B2cTZSUXRpUjRRMFF0WHZoSUtEZ1pnUXdOQllDd0syeGtuREFiQ290MnNrNjJ5WWJ1c1lvN3dDUDl2NFAvOE1xTG9DUm15eVJPZlpFUjdhV1VPZUdOZVlNVEErVnRLUHBGUVBOOTEzREJMbG5qdjJmWnpnVSszZDNCOXBsZmhzUVI2Mk5UMGhFQWVRKzc4YjB1ME4vNFBSVGZVZ01CZ0JMK2o3c1B2c3lyNHZaVktFY2VSemE3VDc5OXU4MFlVU2ZTUWlMNDY4NDFRZENRU2g3TEN3RVE4U3dnRkJsUjRCWFlWaXFtV1ladUx1VGZBSTJDREZDOGFQcDh2T1lMelRjOStJbkJtNGJMQTVSc0xBcGMrQTdLTjVzK2RGZy9lSG9xUHJ2NTdUZUN2UDk4V1dDcGlETEZLc0xsaldZdzl5Mys3S25CMGZFVGczVnNQQk42N0RRenBTWUh4Tkc1SVE4RVlsQysrRWxnc3ZSVm9PK1I5RWY3MnpPdGZLNUxvSVJHOStPbTNRdEhzWFJqa1pTVGk0K0pPSldKQVZZR3RZaVZYeklKb0YzSzRzNFhjYTl6eE9rWm5mcVhTVU1UczFXbmc0b3pBWlZKeXZ4WDladitkT1ArL2Z2eUY4TDhDU3dWU3RBbEZaNmZ3dTI1OHVTd3dNNGt4NmY0YWxIeC83YUZBUFk3M1UyUG9rVW9RUEpUTUE0R21oUjVrbFdHekdSdGtxMW5aaWlSNlNFUXZ6WDRuRkIyUHdSYkhTTUV4VW5ZMENsdW1VcXpqdkNqNnB4LytJNjZiMFNUYlhMYWc2QXdwZXVYdlM2STlQb0daNnVZNmxMeDE1NUZBZzNwMmFoeGppMGJlaCszQWk2bldNR2JsampEQk9TUjB5RmJ6RkY2UlJBK042SDhJUlNjVEdGWFoyekIwekF4NWh1ak9CTW5iT0tzMit2VSt2SUNmdm9laWJ4SmFaSnQ1eHBnbG0zenRpMFdQb2xuSkQxalJDZlQwa1hHTU1lRW9acmJzNzlkcHB2am0zVlB4L2x2Q21nMmwxMm5NVXBabUpkSEhoTERwR0JyUnlmZ2tLUm5lZ2s1K3BGUTBGQjBoUmFzVS9XdFFWTzhnOTBMOC8rQVFNMUtlTWJJTi81T2lKZEVZQkR1WmpwNkpUaVdnNUNRaEs5blFZWk44SEszN3lHMjBIa05QVndPSS92SGF6RkVlODRtai9MN0FFdnZYRnZ4clY5R1NhTGgzM1d4MHowU3oxM0hlVGNjYjhqcHUvb0Fab2V0MVVGU3Y1WFZnWm5pOWc5ZXh0UUYvMm9oN3ZRNG0yaytLNXZXa293S1V6TW8yVFpveFdvaHVYamdiZlc2SWJ2blJpR1laQm16U2VmRTZPTlp4czh2TU1Ec0pSYnN6d3l6TkRPL1F6SERET3pOa1A3cXpvcjAydXF1aUpkR0RKcHJqenpSRDdEUXpySlVSQlN0YkZMMDc1T2dkc0QxNngvSG9LM09JRmN3c3dCKzkvamxtWkN0ZllBck1xK09pMGNQcjRDMXNJc2VqVjM5R1hOb3MwWFhURERGTjhlZUZaYXhkSm1rdDg5NHRyTERjcFhnMHh6cEdNcmh1UFlvWnN6K0FLRjdMUnA5VTBaSm9RZHpaSWJvQ1pWUkkwWGxXTkdHN29ubHQ3dEkwL1BUTHM1Y0VmdjcxZGVBM0t3S05HTmJrZW4wVjgxajVlYlQ1Uk9ERHpXMkJwcnZDZ2hoRU5JN1Y3Nm5MaVBHRXdsZ3J2ZjNMaHNDMVgrOEsxQ21xNlNvNlJvcjJzNktoNmFOQ3Z4VXRpUmJFK2dkRk5NZWpheFVvb2xMRzZtK0JsRnlrRlJhT1ZyRXllUldjZ3pZVGwrQ1hmdmJWTlEveWNiMHF1bExHMnQzK0hsWjhYcjNBV2lhdmpuTVVMMFI1SFVsYUFlTHZYVis5Si81Y3Avd09QVVlyTEJTUDFza0w0MWdINStMMVRkR1NhQXptQXlmYVQydUdqb05NSGJ1S2xZcFNIbXQwWmdGcmFPMDJ1cFVSQkJzY1M4UUVUbHlDSDhzSzUrTjZWYlJET1hiRlBNYVNZZ0UyMjY0aUQ2Vld3L1c3T1lFNlpValJGNy9jUlU5Z2pFUXhuNGdsY2IyaENQSkJGTXArYlZBMmJkOFVMWWtlRXRFQlAvSTZPRnZUcVVNaDVTS2lVK1VTa0ZkL1d4NG1wTUo1eUc2K05HV1pjcjYwMG5OZU5MNkhiV2FUOHFBYmJmblJQbXE3ZWQ1dXZqY3lvL2pmakNHZDhsMG9EaDNVa0ZIRkx4NlQrcVpvU1RUQ3hRTW5PaGdnUmRPdFp0dkVYZ2huTUxrN0FEejMvZXczM1AwR3RBT0E4OENESWRod1JuYnJCcVpvU1RRSUh3TFJtRG14N1dVYnhsNUd5emJ6WWQ3TS96T3ZhVGQ1bGZib3NPMm1QVHp1WHA2Mm5RaDl0OUdjMWl1SjlxWVQ5NTFvald5MFFsTDJVMlovdUFIdmcxR2w5MXVYYzE2VWpTdHVrR0tiNUFWVlZLd05Wc2pyY21nUEQvOWZFdjNCdHVxTUVCMzI0ODRHS0k4aFVzY01LMU9ELzV5cDVqRTZONUZOeW9wWDNJanRCLy95b1g2QUZXcVRUWFlVN05wNnJjR3RleFZDMUs3b3g2RElicjlEK2VCOTg2TWwwVU1pV3Fld0lOdml1SU1vM3J5RjFkOVpFeGloWExRQTJXcTIyVU9WNXltK2pHMXpsV3h5bGZhdVBORVJyMzZzVHdrODBCQ3JhVkIyclUxNTBIMVR0Q1I2U0VRbktEYVI5Q0hlTzFaSGRHd3VqMXl6dWNLdXdEREZRRlFmOW5xY2JtL1ZLU1RaNDBmWU4yTGJ6TjdGb3hqQ281dHg3RlRZRHlFcm9OYkVEdUlLN2JqdG02SWwwVU1pT2gzRUhaeFVrZWsrVmNjcStOd2g4b0laTmZKR3pvdVMyenNDZXgrczhNMGtWc252akdEMzJQTXc4aitzQnJ5U2tvT2UyemRGUzZLSFJQUUlWUUhJaHJGemRFcUR2enl2d0grZVU2RndqWGFXdGl2bHZMWTNiZmpSNnpaczg2Nk5lTFJWUjU4MWErQ2hiNHFXUkErSjZDVHQ2UjVOSUM2ZFNTR2F0ekNGdGNENVNhQVdvRW8xNTFYQ2JkZTl0WU0xeDQwbjZMRXZEcWhLUW8zM2hHT0czRGRGUzZLSFJIUWlqaGxSS28wTW4vRU0yZ3ZMMkRPK3NBVFVOR1R3WEpUWDFqM3NIN3k3aGlvSmU3dUk3ZFNxc00yY2I5MDNSVXVpSmRFRDdUeFMwUU9sdDNWeVNiUWtXZzZHeHhyb3ZMV2lTeUs2SEF6bFlEaFFJeUp0OUVEcGxZUGhrT2lWUkV1aTVSUzhUNXVGcE5jaHZZNkJtcE8rZXgydHlvMkl3a1dwMnE2aFl3OUhndmFleU9oZGgrZ2QxZW5JRWJyMThOcnJkVWlpMzk4eFRxem83a1I3Njk3RnFjNGJWM2JrK25lSkJQWnlTRVczS3hxNzAzSkhMd1Z5M1R1TDZuU1VLMWd3K0ZQZE8wbTBWOW5kRmYyQlJITzk2RmdNZVF0dU80cDJNb0hWWUtubzl5djZrS3VFNVpDeFpaV1JIY0RWd2x4RlM2SlBhNk9oNks1RUw3cjFvNkhZU0FTWVRNRDc0RnBMcVJTOGo1RTBkbzVtc3JEWkg5dWE0WXZucUpYRWU4NU5lcllCMTd0cnIzdkhOVXdWU2ZUN2xjenZ0dHZvVXhQTnBlZTFJTzJuSXh4Sm9hNUdPbzFzeXRFMGJIVjZGS3ZmbVN3U1NqNDJSZS91WU0rN1pTRS92RmlFVi9IdTRKa0hiUnNtaFd2K3V6WCtKZEh2VjNhN29uc2dHczlkOFZPbXUwcDdWYmdTZW9KdE5kdm9GR3p6NkRocytaVlBVYytDTVJoRWx1VkZlVzAvUnJEbzBRUDR5ZnN2U2RFbThzTkxKdXFXNUtrQ1RaNG1McnhYbmplWEt3dFhKTkYvSllxK0VjMFB1Rkg1R1ZpMHowNmpaMlR4czdJTUE3WTVUaGxMeVNTVVBaYUJyUjRiQjNJZGpJdWk2UDA5ZUJsN3U2aExjbmpJdGZ5cDZoaFZUYXZWMEs0UzhwNTRmanFjSW9uK2EwbjBqZWhPWDhQZUNPL3lEMm4wOURZZGZyUmhBUGxaVXpGNjVoVFg1YmdvaXM3bllZT1BjdkF1ekJLeVN5djBQSnFhN1gwY1gvc1RoWmlIampzZ0pOR2dhQWhFWTVEa2ZWVmNQb0dmTzZnRmtTZXQwUk0yK2YxVFBvYnd6SGFBYWhYNXp6d1Q1SnBNWEZ2S29ScituWlI4QWtWTG9zWGdObWlpTzl0dTd3MW9LZmk4N3NQcTFwbTh6Nnpsbzl1ZmhkWHRMQi9NRHZ2ZGJGSWswZDBveHYvL0FNb0JuZDhIdENJSUFBQUFBRWxGVGtTdVFtQ0MiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoxOC41OjE1LjUtLT4=", 
                "docsURI": "https://savecodes-doc.vercel.app" 
            };
        }
    }

    blocks.push({
        opcode: `reset`,
        blockType: Scratch.BlockType.COMMAND,
        text: `reset savecode`,
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });

    Extension.prototype[`reset`] = (args, util) => {
        variables['savecode'] = '';
        variables['readIndex'] = 0;
        variables['readParts'] = [];
    };

    blocks.push({
        opcode: `setsave`,
        blockType: Scratch.BlockType.COMMAND,
        text: `set SaveCode to [set]`,
        isEdgeActivated: false,
        arguments: {
            "set": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'chicken|butt|',
            },
        },
        disableMonitor: true
    });

    Extension.prototype[`setsave`] = (args, util) => {
        variables['savecode'] = args["set"];
        variables['readIndex'] = 0;
        variables['readParts'] = variables['savecode'].split('|');
    };

    blocks.push({
        opcode: `write`,
        blockType: Scratch.BlockType.COMMAND,
        text: `write value [text]`,
        isEdgeActivated: false,
        arguments: {
            "text": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'chicken',
            },
        },
        disableMonitor: true
    });

    Extension.prototype[`write`] = (args, util) => {
        if (!variables['savecode']) {
            variables['savecode'] = '';
        }
        variables['savecode'] += args["text"] + '|';
        variables['readParts'] = variables['savecode'].split('|');
    };

    blocks.push({
        opcode: `getsave`,
        blockType: Scratch.BlockType.REPORTER,
        text: `Get SaveCode`,
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });

    Extension.prototype[`getsave`] = (args, util) => {
        return variables['savecode'] || '';
    };

    blocks.push({
        opcode: `pre`,
        blockType: Scratch.BlockType.COMMAND,
        text: `prepare to read`,
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });

    Extension.prototype[`pre`] = (args, util) => {
        variables['readIndex'] = 0;
        variables['readParts'] = variables['savecode'] ? variables['savecode'].split('|') : [];
    };

    blocks.push({
        opcode: `return`,
        blockType: Scratch.BlockType.REPORTER,
        text: `return read value`,
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });

    Extension.prototype[`return`] = (args, util) => {
        const index = variables['readIndex'] || 0;
        const parts = variables['readParts'] || [];
        if (index >= parts.length) {
            return '';
        }
        const value = parts[index];
        variables['readIndex'] = index + 1;
        return value;
    };

    Scratch.extensions.register(new Extension());
})(Scratch);