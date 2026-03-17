import { Component, Input, Output, EventEmitter, inject, ElementRef, OnChanges, SimpleChanges, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Pipe({
  name: 'groupBy',
  standalone: true
})
export class GroupByPipe implements PipeTransform {
  transform(collection: any[], property: string): any[] {
    if (!collection) return [];
    const groupedCollection = collection.reduce((previous, current) => {
      // Garante que se a categoria for vazia, agrupe em 'OUTROS'
      const key = current[property] ? current[property].toUpperCase() : 'OUTROS';
      if (!previous[key]) {
        previous[key] = [current];
      } else {
        previous[key].push(previous[key].indexOf(current) === -1 ? current : null);
      }
      return previous;
    }, {});

    return Object.keys(groupedCollection).map(key => ({
      key,
      value: groupedCollection[key]
    }));
  }
}

@Component({
  selector: 'app-nota-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    GroupByPipe 
  ],
  templateUrl: './nota-detalhes.html',
  styleUrls: ['./nota-detalhes.scss'],
})
export class NotaDetalhes implements OnChanges {
  private dialog = inject(MatDialog);
  private elementRef = inject(ElementRef);

  @Input() nota: any;
  @Output() fechar = new EventEmitter<void>();
  @Output() excluir = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nota'] && changes['nota'].currentValue) {
      this.executarRolagem();
    }
  }

  getIcon(categoria: string): string {
    if (!categoria) return 'inventory_2';
    
    const icons: { [key: string]: string } = {
      'ALIMENTOS': 'restaurant',
      'BEBIDAS': 'local_drink',
      'HIGIENE': 'sanitizer',
      'LIMPEZA': 'cleaning_services',
      'HORTIFRUTI': 'eco',
      'CARNES': 'kebab_dining',
      'PADARIA': 'bakery_dining',
      'OUTROS': 'inventory_2'
    };

    return icons[categoria.toUpperCase()] || 'inventory_2';
  }

  private executarRolagem() {
    setTimeout(() => {
      this.elementRef.nativeElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  }

  fecharNota() {
    this.fechar.emit();
  }

  removerNota(chave: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.excluir.emit(chave);
      }
    });
  }
}

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Excluir Nota</h2>
    <mat-dialog-content>Deseja realmente remover esta nota?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>CANCELAR</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">EXCLUIR</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {}