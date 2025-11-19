import  iVideoRepository from "../../infraestructure/repositories/iVideoRepository.js";

export  class getByTopic {

    private readonly _repo:iVideoRepository;

    constructor(repo:iVideoRepository){
        this._repo = repo;
    }

    get repo(): iVideoRepository {
        return this._repo;
    }

    execute = async (topic:string)=>{
        return this.repo.getByTopic(topic);
    }
}