import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Photo } from '../../../core/models/photo.model';
import { downloadPhoto } from '../../../core/utils/download';

@Component({
  selector: 'app-photo-card',
  imports: [MatCard, MatIconButton, MatIcon],
  templateUrl: './photo-card.html',
  styleUrl: './photo-card.scss',
})
export class PhotoCard {
  readonly photo = input.required<Photo>();
  readonly favorite = input(false);
  readonly photoClick = output<Photo>();
  readonly favoriteToggle = output<Photo>();
  readonly tagClick = output<string>();

  protected onFavorite(event: Event): void {
    event.stopPropagation();
    this.favoriteToggle.emit(this.photo());
  }

  protected onDownload(event: Event): void {
    event.stopPropagation();
    downloadPhoto(this.photo());
  }

  protected onTag(event: Event, tag: string): void {
    event.stopPropagation();
    this.tagClick.emit(tag);
  }
}
