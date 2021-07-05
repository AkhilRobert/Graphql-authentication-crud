import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert } from 'typeorm';
import argon2 from 'argon2';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  @Field(() => ID)
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  @Field()
  @MaxLength(20)
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  private async _hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  async isCorrectPassword(plainPassword: string): Promise<boolean> {
    return await argon2.verify(this.password, plainPassword);
  }
}

@InputType()
export class RegisterUser {
  @Field()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(3)
  password: string;
}

@InputType()
export class LoginUser {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(3)
  password: string;
}
