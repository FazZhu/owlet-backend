import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class ValidJwt {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column({ type: 'timestamp' })
    created_at: Date

    @Column()
    user_id: string

    @Column({ nullable: false })
    jwt: string

    @Column({ type: 'tinyint', nullable: false })
    blocked: number
}