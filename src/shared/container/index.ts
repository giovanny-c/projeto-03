import { container } from "tsyringe";

import "./providers/index"

import { UsersRepository } from "../../modules/accounts/repositories/implementations/UsersRepository";
import { IUsersRepository } from "../../modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "../../modules/accounts/repositories/IUsersTokensRepository";
import { UsersTokensRepository } from "../../modules/accounts/repositories/implementations/UsersTokensRepository";
import { IFileRepository } from "@modules/File/repositories/IFileRepository";
import { FileRepository } from "@modules/File/repositories/implementations/FileRepository";


container.registerSingleton<IUsersRepository>(
    "UsersRepository",
    UsersRepository
)

container.registerSingleton<IUsersTokensRepository>(
    "UsersTokensRepository",
    UsersTokensRepository
)

container.registerSingleton<IFileRepository>(
    "FileRepository",
    FileRepository
)