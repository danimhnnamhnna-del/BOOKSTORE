export function Log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  // Method decorator: wrap the original method and preserve `this`
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    // Avoid JSON.stringify throwing on circular structures
    let argsString = "";
    try {
      argsString = JSON.stringify(args);
    } catch {
      argsString = "[unserializable args]";
    }

    console.log(`[LOG] Calling ${propertyKey} with arguments:`, argsString);

    // Ensure the wrapper returns exactly what the original returns
    return originalMethod.apply(this, args);
  };

  return descriptor;  
}
