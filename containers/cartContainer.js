const {promises:fs} = require('fs');
class Cart{
    constructor(path){  
        this.path = path;
    }
    async getAll(){ 
        let datos = await fs.readFile(this.path, 'utf-8')
        if(datos.length > 0){
            let jsonDatos = JSON.parse(datos);  
            return jsonDatos;
        }else{
            return []
        }
    }

    async getById(id){
        let objs = await this.getAll();
        let obj = objs.filter(obj => obj.id == id);
        if(obj.length==0){
            return {error: 'carrito no encontrado'};
        }
        return obj;
    }

    async save(obj){        
        let objs = await this.getAll();
        if(objs.length !== 0){
            let data = [...objs, {...obj, id: objs[objs.length-1].id + 1, timestamp: Date.now(), productos: []} ]
            await fs.writeFile(this.path, JSON.stringify(data))
            return data;
        }else{
            let data = [{...obj, id: 1, timestamp: Date.now(), productos: []}]
            await fs.writeFile(this.path, JSON.stringify(data))
            return data;
        }
    }

    async deleteById(id){
        let objs = await this.getAll(); 
        let obj = objs.filter(o => o.id != id);
        try {
            await fs.writeFile(this.path, JSON.stringify(obj, null, 2));
        } catch (error) {
            return `No se puede borrar ese registro`
        }
    }

    async edit(obj){
        let objs = await this.getAll();
        let index = objs.findIndex(o => o.id == obj.id);
        objs[index] = obj;
        try {
            await fs.writeFile(this.path, JSON.stringify(objs, null, 2));
        } catch (error) {
            return []
        }
    }

}

module.exports = Cart