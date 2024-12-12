export const INDUSTRIES = [
  { value: 'Hollywood', label: 'Hollywood' },
  { value: 'Bollywood', label: 'Bollywood' },
  { value: 'Korean', label: 'Korean' },
  { value: 'Japanese', label: 'Japanese' },
];

export const CONTENT_RATINGS_BY_INDUSTRY = {
  Hollywood: [
    { value: 'G', label: 'G (General Audience)' },
    { value: 'PG', label: 'PG (Parental Guidance)' },
    { value: 'PG-13', label: 'PG-13 (13+ Years)' },
    { value: 'R', label: 'R (Restricted)' },
    { value: 'NC-17', label: 'NC-17 (Adults Only)' },
  ],
  Bollywood: [
    { value: 'U', label: 'U (Universal)' },
    { value: 'UA', label: 'U/A (Parental Guidance)' },
    { value: 'A', label: 'A (Adults Only)' },
    { value: 'S', label: 'S (Specialized Audience)' },
  ],
  Korean: [
    { value: 'All', label: 'All (전체 관람가)' },
    { value: '12', label: '12+ (12세 이상)' },
    { value: '15', label: '15+ (15세 이상)' },
    { value: '18', label: '18+ (청소년 관람불가)' },
  ],
  Japanese: [
    { value: 'G', label: 'G (全年齢対象)' },
    { value: 'PG12', label: 'PG12 (12歳以上対象)' },
    { value: 'R15+', label: 'R15+ (15歳以上対象)' },
    { value: 'R18+', label: 'R18+ (18歳以上対象)' },
  ],
};

export const GENRES = [
  { value: '28', label: 'Action' },
  { value: '12', label: 'Adventure' },
  { value: '16', label: 'Animation' },
  { value: '35', label: 'Comedy' },
  { value: '80', label: 'Crime' },
  { value: '99', label: 'Documentary' },
  { value: '18', label: 'Drama' },
  { value: '10751', label: 'Family' },
  { value: '14', label: 'Fantasy' },
  { value: '36', label: 'History' },
  { value: '27', label: 'Horror' },
  { value: '10402', label: 'Music' },
  { value: '9648', label: 'Mystery' },
  { value: '10749', label: 'Romance' },
  { value: '878', label: 'Science Fiction' },
  { value: '53', label: 'Thriller' },
  { value: '10752', label: 'War' },
  { value: '37', label: 'Western' },
];

export const YEARS = Array.from({ length: 74 }, (_, i) => {
  const year = 2024 - i;
  return { value: year.toString(), label: year.toString() };
});