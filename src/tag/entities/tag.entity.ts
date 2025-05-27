import { ArticleTag } from '@/articleTag/entities/articletag.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => ArticleTag, (articletag) => articletag.tag)
  articleTags: ArticleTag[];
}
