export class TestImage {
  constructor() {
    this.dataset = {};
    this.attributes = new Map();

    const values = new Map();
    this.style = {
      values,
      setProperty(name, value) {
        values.set(name, value);
      },
    };
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
}

export function installTestImage() {
  globalThis.Image = TestImage;
  return TestImage;
}
