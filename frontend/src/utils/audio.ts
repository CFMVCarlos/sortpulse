export class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    const storedMute = localStorage.getItem('sortpulse_mute');
    if (storedMute !== null) {
      this.isMuted = storedMute === 'true';
    }
  }

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('sortpulse_mute', muted.toString());
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public playTone(val: number, maxVal: number) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const freq = 120 + (val / maxVal) * (880 - 120);

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    // Linear volume decay
    gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime); // keep volume low to avoid harshness
    gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.03);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.03); // 30ms duration
  }
}

export const audioEngine = new AudioEngine();
