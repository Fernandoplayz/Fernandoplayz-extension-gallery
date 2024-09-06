/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "blockIconURI": "data:image/png;base64,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",
                "id": "localstplue",
                "name": "local storage plus",
                "color1": "#5d0fbd",
                "color2": "#0063ba",
                "tbShow": true,
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: `keyget`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get key [key]`,
        isEdgeActivated: false,
        arguments: {
            "key": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'score',
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`keyget`] = async (args, util) => {
        if (Boolean(!(variables['namespace id'] == ' '))) {
            return localStorage.getItem(((variables['namespace id'] + ' key:') + args["key"]))

        } else {
            alert('Local Storage plus extension: project must run the \"set storage namespace ID\" block before it can use other blocks')

        };
    };

    blocks.push({
        opcode: `keyget2`,
        blockType: Scratch.BlockType.REPORTER,
        text: `get key [key2] from namespace ID [namespace id fetch]`,
        isEdgeActivated: false,
        arguments: {
            "key2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'score',
            },
            "namespace id fetch": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'project title',
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`keyget2`] = async (args, util) => {
        if (Boolean(!(args["namespace id fetch"] == ' '))) {
            if (Boolean(!(localStorage.getItem(((variables['namespace id'] + ' key:') + args["key"])) == 'null'))) {
                return localStorage.getItem(((variables['namespace id'] + ' key:') + args["key"]))

            } else {
                alert('Local Storage plus extension: project must run the \"set storage namespace ID\" block before it can use other blocks')

            };

        } else {
            alert('Local Storage plus extension: project must run the \"set storage namespace ID\" block before it can use other blocks')

        };
    };

    blocks.push({
        opcode: `setkey`,
        blockType: Scratch.BlockType.COMMAND,
        text: `set key [set key name] to [set key]`,
        isEdgeActivated: false,
        arguments: {
            "set key name": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'score',
            },
            "set key": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1000',
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`setkey`] = async (args, util) => {
        if (Boolean(!(variables['namespace id'] == ' '))) {
            localStorage.setItem(((variables['namespace id'] + ' key:') + args["set key name"]), args["set key"])
            variables['local storage data updated'] = '1'
            localStorage.setItem('local storage data updated', '1')
            localStorage.setItem((variables['namespace id'] + ' total keys'), (localStorage.getItem((variables['namespace id'] + ' total keys')) + 1))
            if (Boolean(!await (async () => {
                    try {
                        JSON.parse(localStorage.getItem((variables['namespace id'] + ' all keys')));
                        return true;
                    } catch {
                        return false;
                    }
                })())) {
                localStorage.setItem((variables['namespace id'] + ' all keys'), await (async () => {
                    try {
                        return JSON.parse(((variables['namespace id'] + ' key:') + args["set key name"]));
                    } catch {
                        return false;
                    }
                })())

            } else {
                variables['num on'] = '1'
                for (var KgyKzNagVqAMXMmW = 0; KgyKzNagVqAMXMmW < localStorage.getItem((variables['namespace id'] + ' total keys')); KgyKzNagVqAMXMmW++) {
                    if (Boolean(variables['num on'][Array(localStorage.getItem((variables['namespace id'] + ' all keys')))])) {
                        break;
                    };
                    variables['num on'] = (variables['num on'] + 1)
                }
                localStorage.setItem((variables['namespace id'] + ' all keys'), Array(localStorage.getItem((variables['namespace id'] + ' all keys'))).concat(await (async () => {
                    try {
                        return JSON.parse(((variables['namespace id'] + ' key:') + args["set key name"]));
                    } catch {
                        return false;
                    }
                })()))

            };

        } else {
            alert('Local Storage plus extension: project must run the \"set storage namespace ID\" block before it can use other blocks')

        };
    };

    blocks.push({
        opcode: `namespaceid`,
        blockType: Scratch.BlockType.COMMAND,
        text: `Storage namespace ID [namespace id]`,
        isEdgeActivated: false,
        arguments: {
            "namespace id": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'project title',
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`namespaceid`] = async (args, util) => {
        variables['namespace id'] = args["namespace id"]
    };

    blocks.push({
        opcode: `id`,
        blockType: Scratch.BlockType.REPORTER,
        text: `namespace ID`,
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`id`] = async (args, util) => {
        return variables['namespace id']
    };

    setInterval(async () => {
        if (Boolean(!(variables['udated id'] == '1'))) {
            variables['namespace id'] = ' '
            variables['udated id'] = '1'
        };
    }, (1 * 1000));

    blocks.push({
        opcode: `delete`,
        blockType: Scratch.BlockType.COMMAND,
        text: `delete key [key delete]`,
        isEdgeActivated: false,
        arguments: {
            "key delete": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'score',
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`delete`] = async (args, util) => {
        if (Boolean(!(variables['namespace id'] == ' '))) {
            localStorage.setItem(((variables['namespace id'] + ' key:') + args["set key name"]), '')

        } else {
            alert('Local Storage plus extension: project must run the \"set storage namespace ID\" block before it can use other blocks')

        };
    };

    blocks.push({
        opcode: `windowchange`,
        blockType: Scratch.BlockType.EVENT,
        text: `When another window changes storage`,
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`windowchange`] = async (args, util) => {};

    blocks.push({
        opcode: `deleteall`,
        blockType: Scratch.BlockType.COMMAND,
        text: `delete all keys`,
        isEdgeActivated: false,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`deleteall`] = async (args, util) => {
        if (Boolean(!(variables['namespace id'] == ' '))) {
            variables['num on'] = 1
            for (var UKgEtCWoKEpMxkwj = 0; UKgEtCWoKEpMxkwj < localStorage.getItem((variables['namespace id'] + ' total keys')); UKgEtCWoKEpMxkwj++) {
                localStorage.setItem(variables['num on'][Array(localStorage.getItem((variables['namespace id'] + ' all keys')))], '')
                variables['num on'] = (variables['num on'] + 1)
            }
            localStorage.setItem(localStorage.getItem((variables['namespace id'] + ' total keys')), '')
            localStorage.setItem(localStorage.getItem((variables['namespace id'] + 'all keys')), '')

        } else {
            alert('Local Storage plus extension: project must run the \"set storage namespace ID\" block before it can use other blocks')

        };
    };

    setInterval(async () => {
        if (Boolean(((localStorage.getItem('local storage data updated') == '1') && (variables['local storage data updated'] == '0')))) {
            localStorage.setItem('local storage data updated', '')
            Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_windowchange`)
        };
    }, (1 * 1000));

    Scratch.extensions.register(new Extension());
})(Scratch);