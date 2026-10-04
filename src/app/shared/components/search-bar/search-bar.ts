import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatChipListbox, MatChipListboxChange, MatChipOption } from '@angular/material/chips';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { SearchService } from '../../../core/services/search.service';
import { TAGS } from '../../../core/utils/tag-generator';

@Component({
  selector: 'app-search-bar',
  imports: [MatFormField, MatInput, MatIcon, MatPrefix, MatButton, MatChipListbox, MatChipOption],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  protected readonly search = inject(SearchService);
  protected readonly tags = TAGS;

  protected onTagsChange(event: MatChipListboxChange): void {
    this.search.tags.set(event.value as string[]);
  }
}