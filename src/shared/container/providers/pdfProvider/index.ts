import { container } from "tsyringe";
import { Pdf_LibProvider } from "./implementations/Pdf_LibProvider";
import { IPdfProvider } from "./IPdfProvider";




container.registerSingleton<IPdfProvider>(
    "PdfLibProvider",
    Pdf_LibProvider
)