import { vibeStyles, type VibeType } from '../../themes/vibes';

interface HeroOverlayImageProps {
  backgroundImage: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  vibeStyle?: VibeType;
}

export default function HeroOverlayImage({
  backgroundImage,
  title,
  subtitle,
  buttonText,
  buttonLink,
  vibeStyle = 'minimal'
}: HeroOverlayImageProps) {
  const style = vibeStyles[vibeStyle];

  return (
    <div
      className={`hero min-h-screen ${style.container}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={style.overlay}></div>
      <div className={style.content}>
        <div className="max-w-md">
          <h1 className={style.heading}>{title}</h1>
          {subtitle && <p className={style.subtitle}>{subtitle}</p>}
          {buttonText && (
            <a href={buttonLink ?? "#"} className={style.button}>
              {buttonText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
