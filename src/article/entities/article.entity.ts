import { ArticleStatus } from '@/article/interface/article.interface';
import { ArticleTag } from '@/articleTag/entities/articletag.entity';
import { User } from '@/auth/entities/user.entity';
import { Category } from '@/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.PENDING,
  })
  status: string;

  @Column({
    nullable: true,
  })
  image: string;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;
  @Column({
    type: 'uuid',
  })
  categoryId: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
  @Column({
    type: 'uuid',
  })
  userId: string;

  @OneToMany(() => ArticleTag, (articletag) => articletag.article)
  articleTags: ArticleTag[];

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;
}
