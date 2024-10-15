import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('credentials')
export class CredentialEntity {
    @PrimaryColumn({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    refreshToken: string;
}