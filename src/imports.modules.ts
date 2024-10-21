import { CredentialModule } from "./modules/credentials/credential.module";
import { MovieModule } from "./modules/movies/movie.module";
import { UploadingModule } from "./modules/uploading/uploading.module";

export const importModules = [
    CredentialModule,
    MovieModule,
    UploadingModule,
];