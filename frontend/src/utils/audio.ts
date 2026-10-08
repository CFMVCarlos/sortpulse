/**
 * AudioEngine synthesizes real-time sound frequencies for sorting operations
 * using the Web Audio API with pitch mapping proportional to element values.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    const storedMute = localStorage.getItem('sortpulse_mute');
    if (storedMute !== null) {
      this.isMuted = storedMute === 'true';
    }
  }

  /**
   * Initializes the AudioContext lazily on user interaction.
   */
  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  /**
   * Returns whether audio output is currently muted.
   */
  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Updates mute state and saves preference to localStorage.
   */
  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('sortpulse_mute', muted.toString());
  }

  /**
   * Toggles the current mute state and returns the new value.
   */
  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Synthesizes a brief triangle-wave pitch mapped between 120Hz and 880Hz.
   * @param val Current element value being sorted.
   * @param maxVal Maximum element value in the array.
   */
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
    gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.03);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.03); // 30ms duration
  }
}

export const audioEngine = new AudioEngine();
