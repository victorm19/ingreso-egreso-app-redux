export class Usuario {

    static fromFirebase(firestoreUser: any) {
        const { email, uid, nombre } = firestoreUser;
        return new Usuario(uid, nombre, email);
    }

    constructor(
        public uid?: string, 
        public nombre?: string, 
        public email?: string
    ) {}
}