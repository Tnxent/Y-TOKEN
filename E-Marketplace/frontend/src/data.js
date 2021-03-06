import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Song',
      email: 'admin@emarket.com',
      password: bcrypt.hashSync('1234', 8),
      isAdmin: true,
      isSeller: true,
      seller: {
        name: 'Admin',
        logo: '/images/logo1.png',
        description: 'best seller',
        rating: 4.5,
        numReviews: 120,
      },
    },
    {
      name: 'John',
      email: 'user@amazona.com',
      password: bcrypt.hashSync('1234', 8),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Adele-21',
      category: 'Music',
      image: '/images/Adele-21.jpg',
      price: 120,
      countInStock: 10,
      brand: 'Adele',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality product',
      content: '/images/Adele-21.jpg',
    },
    {
      name: 'AKMU-Dinosaur',
      category: 'Music',
      image: '/images/AKMU-Dinosaur.jpg',
      price: 100,
      countInStock: 20,
      brand: 'AKMU',
      rating: 4.0,
      numReviews: 10,
      description: 'high quality product',
      content: '/images/AKMU-Dinosaur.jpg',
    },
    {
      name: 'Conan_Gray-Maniac',
      category: 'Music',
      image: '/images/Conan_Gray-Maniac.jpg',
      price: 220,
      countInStock: 10,
      brand: 'Conan_Gray',
      rating: 4.8,
      numReviews: 17,
      description: 'high quality product',
      content: '/images/Conan_Gray-Maniac.jpg',
    },
    {
      name: 'GD-COUP_DETAT',
      category: 'Music',
      image: '/images/GD-COUP_DETAT.jpg',
      price: 78,
      countInStock: 15,
      brand: 'GD',
      rating: 4.5,
      numReviews: 14,
      description: 'high quality product',
      content: '/images/GD-COUP_DETAT.jpg',
    },
    {
      name: 'LOCO,GRAY-LateNight',
      category: 'Music',
      image: '/images/LOCO,GRAY-LateNight.jpg',
      price: 65,
      countInStock: 5,
      brand: 'LOCO,GRAY',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality product',
      content: '/images/LOCO,GRAY-LateNight.jpg',
    },
    {
      name: 'SashaSolan-Dancing_With_Your_Ghost',
      category: 'Music',
      image: '/images/SashaSolan-Dancing_With_Your_Ghost.jpg',
      price: 139,
      countInStock: 12,
      brand: 'SashaSolan',
      rating: 4.5,
      numReviews: 15,
      description: 'high quality product',
      content: '/images/SashaSolan-Dancing_With_Your_Ghost.jpg',
    },
  ],
};
export default data;