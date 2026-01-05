import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
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
  title = 'portfolio';
  
  // Carousel properties
  currentSlide = 0;
  totalSlides = 2;

  @ViewChildren('video0, video1') videos!: QueryList<ElementRef<HTMLVideoElement>>;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.playCurrentVideo();
  }

  ngOnDestroy(): void {
    this.pauseAllVideos();
  }

  onVideoEnded(): void {
    this.nextSlide();
  }

  nextSlide(): void {
    this.pauseAllVideos();
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    setTimeout(() => this.playCurrentVideo(), 100);
  }

  prevSlide(): void {
    this.pauseAllVideos();
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    setTimeout(() => this.playCurrentVideo(), 100);
  }

  goToSlide(index: number): void {
    if (index !== this.currentSlide) {
      this.pauseAllVideos();
      this.currentSlide = index;
      setTimeout(() => this.playCurrentVideo(), 100);
    }
  }

  private playCurrentVideo(): void {
    const videosArray = this.videos?.toArray();
    if (videosArray && videosArray[this.currentSlide]) {
      const video = videosArray[this.currentSlide].nativeElement;
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  private pauseAllVideos(): void {
    this.videos?.forEach(videoRef => {
      const video = videoRef.nativeElement;
      video.pause();
      video.currentTime = 0;
    });
  }
}
