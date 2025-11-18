import  iVideoRepository from "../../infraestructure/repositories/iVideoRepository.js";

export  class getById {

    private readonly _repo:iVideoRepository;

    constructor(repo:iVideoRepository){
        this._repo = repo;
    }

    get repo(): iVideoRepository {
        return this._repo;
    }

    execute = async (id:string)=>{
        const result = this.repo.getById(id);
        console.log(result);
        return  result;
    }
}