
interface IPdfProvider {

    ConvertToPdfFile(data /*: JSON | string[]*/, saveOnApp?: boolean)

}

export { IPdfProvider }