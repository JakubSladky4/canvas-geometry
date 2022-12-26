class Utils {
  static getId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default Utils;
