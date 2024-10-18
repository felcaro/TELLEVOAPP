import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-car',
  templateUrl: './chat-car.page.html',
  styleUrls: ['./chat-car.page.scss'],
})
export class ChatCarPage implements OnInit {

  messages: { text: string, time: string, type: 'chofer' | 'usuario' }[] = [
    { text: 'Hola, ¿cómo estás?', time: '10:00 AM', type: 'chofer' },
    { text: 'Estoy bien, gracias. ¿Y tú?', time: '10:01 AM', type: 'usuario' },
    { text: 'Todo bien, gracias por preguntar.', time: '10:02 AM', type: 'chofer' }
  ];

  newMessage: string = '';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit() {

  }


  updateDarkModeClass(isDark: boolean) {
    if (isDark) {
      this.renderer.addClass(this.el.nativeElement, 'dark-mode');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'dark-mode');
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
      this.messages.push({ text: this.newMessage, time, type: 'usuario' });
      this.newMessage = ''; 
    }
  }
}
