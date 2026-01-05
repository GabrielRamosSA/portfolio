import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  titulo = 'portfolio';
  slideAtual = 0;
  totalSlides = 2;
  private observador!: IntersectionObserver;

  @ViewChildren('video0, video1') videos!: QueryList<ElementRef<HTMLVideoElement>>;
  @ViewChild('secaoProjetos') secaoProjetos!: ElementRef;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.configurarObservador();
    }, 500);
  }

  ngOnDestroy(): void {
    this.pausarTodosVideos();
    if (this.observador) {
      this.observador.disconnect();
    }
  }

  private configurarObservador(): void {
    const opcoes = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3
    };

    this.observador = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          this.reproduzirVideoAtual();
        } else {
          this.pausarTodosVideos();
        }
      });
    }, opcoes);

    if (this.secaoProjetos?.nativeElement) {
      this.observador.observe(this.secaoProjetos.nativeElement);
    }
  }

  aoTerminarVideo(): void {
    this.proximoSlide();
  }

  proximoSlide(): void {
    this.pausarTodosVideos();
    this.slideAtual = (this.slideAtual + 1) % this.totalSlides;
    setTimeout(() => this.reproduzirVideoAtual(), 100);
  }

  slideAnterior(): void {
    this.pausarTodosVideos();
    this.slideAtual = (this.slideAtual - 1 + this.totalSlides) % this.totalSlides;
    setTimeout(() => this.reproduzirVideoAtual(), 100);
  }

  irParaSlide(indice: number): void {
    if (indice !== this.slideAtual) {
      this.pausarTodosVideos();
      this.slideAtual = indice;
      setTimeout(() => this.reproduzirVideoAtual(), 100);
    }
  }

  private reproduzirVideoAtual(): void {
    const listaVideos = this.videos?.toArray();
    if (listaVideos && listaVideos[this.slideAtual]) {
      const video = listaVideos[this.slideAtual].nativeElement;
      video.currentTime = 0;
      video.muted = true;
      video.play().catch(() => {});
    }
  }

  private pausarTodosVideos(): void {
    this.videos?.forEach(videoRef => {
      const video = videoRef.nativeElement;
      video.pause();
    });
  }
}

