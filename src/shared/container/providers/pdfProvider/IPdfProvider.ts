
interface IPdfProvider {

    CreatePdf(data /*: JSON | string[]*/, saveOnApp?: boolean)

}

export { IPdfProvider }