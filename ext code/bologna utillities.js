class Bolognauts {
  constructor(runtime) {
    this.runtime = runtime;
  }

  getInfo() {
    return {
      id: 'bolognauts',
      name: 'Bologna Utilities',
      blocks: [
        {
          opcode: 'sayBologna',
          blockType: Scratch.BlockType.REPORTER,
          text: 'say bologna',
        },
      ],
    };
  }

  sayBologna() {
    return 'bologna';
  }
}

Scratch.extensions.register(new Bolognauts());
class Bolognauts {
  constructor(runtime) {
    this.runtime = runtime;
  }

  getInfo() {
    return {
      id: 'bolognauts',
      name: 'Bologna Utilities',
      blocks: [
        {
          opcode: 'sayBologna',
          blockType: Scratch.BlockType.REPORTER,
          text: 'say bologna',
        },
      ],
    };
  }

  sayBologna() {
    return 'bologna';
  }
}

Scratch.extensions.register(new Bolognauts());
