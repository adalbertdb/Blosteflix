import  iVideoRepository from "../../infraestructure/repositories/iVideoRepository.js";
import type {videolistDTO} from "../DTO/videolistDTO.js";


export  class getVideolist {

    private readonly _repo:iVideoRepository;

    constructor(repo:iVideoRepository){
        this._repo = repo;
    }


    get repo(): iVideoRepository {
        return this._repo;
    }

    async execute():Promise<videolistDTO[]> {
        return this.repo.getVideolist();
    }
}