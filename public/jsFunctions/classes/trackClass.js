import axios from "axios";

export class TrackCard {
  constructor({ card, id, likes, dislikes, likeUserResponse }) {
    this.card = card;
    this.id = id;
    this.likes = likes;
    this.dislikes = dislikes;
    this.likeUserResponse = likeUserResponse;
  }

  async like(user, amt) {
    const response = await axios.post(
      `http://localhost:5000/getTracks/like/${this.id}`,
      {
        data: { amt },
      }
    );
    if (amt > 0) {
      this.likeUserResponse = true;
    }
    else{
        this.likeUserResponse = false
    }
    console.log(response.data);
  }

  async dislike(user, amt) {
    const response = await axios.post(
      `http://localhost:5000/getTracks/like/${this.id}`,
      {
        data: { amt },
      }
    );
    console.log(response.data);
  }
}
