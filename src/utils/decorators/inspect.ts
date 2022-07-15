
export function inspect() {

    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value

        descriptor.value = async function (...args: any[]) {

            console.log(`--- Método ${propertyKey}`)
            console.log(`------- Parâmetros: ${args}`)

            const functionReturn = await originalMethod.apply(this, args)

            console.log(`------- Retorno: ${JSON.stringify(functionReturn)}`)

            return functionReturn
        }

        //return descriptor
    }
}