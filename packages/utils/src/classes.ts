export function cx(
  ...classes: Array<
    string | Record<string, boolean | null | undefined> | null | undefined
  >
): string {
  // class helper that turns a list of classes into a single string
  // if one of the classes is an object, it will add the key if the value is truthy

  // e.g. cx("foo", "bar") => "foo bar"
  // e.g. cx("foo", { bar: true }) => "foo bar"
  
  //declare an array to store the resolved class names
  const resolved: string[] = [];

  //loop through the input classes
  for (const entry of classes) {
    //if the entry is falsy, skip it
    if (!entry) {
      continue;
    }

    //if the entry is a string, add it to the resolved array
    if (typeof entry === "string") {
      resolved.push(entry);
      continue;
    }

    //if the entry is an object, loop through its keys and add the key if the value is truthy
    for (const [name, enabled] of Object.entries(entry)) {
      if (enabled) {
        resolved.push(name);
      }
    }
  }
  //join the resolved class names with a space and return the result
  return resolved.join(" ");
}

export default cx;
