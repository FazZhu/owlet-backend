import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class UserTable {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string

    @Column({ type: 'timestamp' })
    created_at: Date

    @Column()
    username: string

    @Column({ select: false })
    passwd: string

    @Column({ type: 'int', nullable: false })
    role: number

    @Column({ type: 'tinyint', nullable: false })
    available: number
}