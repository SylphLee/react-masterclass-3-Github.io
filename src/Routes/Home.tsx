import { useQuery } from "react-query";
import { IGetMoviesResult, getLastestMovies, getMovies, getTopMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate, PathMatch } from "react-router-dom";
import { MdInfoOutline } from "react-icons/md";


const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 60vh; 
  display: flex ;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 18px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  padding-bottom: 250px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);  
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div) <{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  height: 200px;  
  font-size: 66px;  
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 16px;
  }
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 60vh;
  top: 0;
  left: 0;
  right: 0;  
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div<{ bgPhoto: string }>`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center center;
  background-image: linear-gradient(to top, black, transparent), url(${(props) => props.bgPhoto});
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  text-align: center;
  font-size: 28px;
  position: relative;
  padding: 10px;
  top: -60px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  top: -60px;
`;

const SliderTitle = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  font-size: 48px;
  p {    
    color: ${(props) => props.theme.white.lighter};
    position: relative;
    font-size: 20px;
    cursor: pointer;
  }
`;

const BannerButton = styled.button`
  width: 160px;
  height: 50px;
  user-select: none;
  cursor: pointer;
  background: ${(props) => props.theme.white.lighter};
  border: none;
  border-radius: 10px;
  font-size: 16px;
  line-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;  
  transition: all 0.3s ease-in-out;
  margin-top: 20px;
  svg {
    font-size: 20px;
  }  
  &:hover {
    scale: 1.1;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  }
}

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.3,
      duaration: 0.3,
      type: "tween"
    },
  },
}

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duaration: 0.3,
      type: "tween"
    },
  },
}

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const bigMoveMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "newPlaying"], getMovies);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate(-1);
  const clickedMovie = bigMoveMatch?.params.movieId && data?.results.find(movie => movie.id + "" === bigMoveMatch.params.movieId);

  // Lastest   
  const { data: Ldata, isLoading: isLLoading } = useQuery<IGetMoviesResult>(["movies", "latest"], getLastestMovies);
  const [Lindex, setLIndex] = useState(0);
  const [Lleaving, setLLeaving] = useState(false);
  const incraseLIndex = () => {
    if (Ldata) {
      if (Lleaving) return;
      setLLeaving(true);
      const totalLMovies = Ldata.results.length - 1;
      const maxLIndex = Math.floor(totalLMovies / offset) - 1;
      setLIndex((prev) => (prev === maxLIndex ? 0 : prev + 1));
    }
  };
  const toggleLLeaving = () => setLLeaving((prev) => !prev);
  const onBoxLClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const clickedLMovie = bigMoveMatch?.params.movieId && Ldata?.results.find(movie => movie.id + "" === bigMoveMatch.params.movieId);

  // Top Rated  
  const { data: Tdata, isLoading: isTLoading } = useQuery<IGetMoviesResult>(["movies", "top_rated"], getTopMovies);
  const [Tindex, setTIndex] = useState(0);
  const [Tleaving, setTLeaving] = useState(false);
  const incraseTIndex = () => {
    if (Tdata) {
      if (Tleaving) return;
      setTLeaving(true);
      const totalMovies = Tdata.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setTIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleTLeaving = () => setTLeaving((prev) => !prev);
  const onBoxTClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const clickedTMovie = bigMoveMatch?.params.movieId && Tdata?.results.find(movie => movie.id + "" === bigMoveMatch.params.movieId);

  // Upcoming   
  const { data: Udata, isLoading: isULoading } = useQuery<IGetMoviesResult>(["movies", "upcoming"], getMovies);
  const [Uindex, setUIndex] = useState(0);
  const [Uleaving, setULeaving] = useState(false);
  const incraseUIndex = () => {
    if (Udata) {
      if (Uleaving) return;
      setULeaving(true);
      const totalMovies = Udata.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setUIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleULeaving = () => setULeaving((prev) => !prev);
  const onBoxUClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const clickedUMovie = bigMoveMatch?.params.movieId && Udata?.results.find(movie => movie.id + "" === bigMoveMatch.params.movieId);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>
              {data?.results[0].title}
            </Title>
            <Overview>
              {data?.results[0].overview}
            </Overview>
            <BannerButton
              onClick={() =>
                onBoxClicked(Number(data?.results[0].id))
              }
            >
              <MdInfoOutline />
              상세정보
            </BannerButton>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <SliderTitle>Now Playing<p onClick={incraseIndex} >다음</p></SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results.slice(1).slice(offset * index, offset * index + offset).map((movie) => (
                  <Box
                    key={movie.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    onClick={() => onBoxClicked(movie.id)}
                    layoutId={movie.id + "n"}
                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLLeaving}>
              <SliderTitle>Popular<p onClick={incraseLIndex} >다음</p></SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={Lindex}
              >
                {Ldata?.results.slice(1).slice(offset * Lindex, offset * Lindex + offset).map((movie) => (
                  <Box
                    key={movie.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    onClick={() => onBoxLClicked(movie.id)}
                    layoutId={movie.id + "p"}
                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleTLeaving}>
              <SliderTitle>Top Rated<p onClick={incraseTIndex} >다음</p></SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={Tindex}
              >
                {Tdata?.results.slice(1).slice(offset * Tindex, offset * Tindex + offset).map((movie) => (
                  <Box
                    key={movie.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    onClick={() => onBoxTClicked(movie.id)}
                    layoutId={movie.id + "t"}
                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleULeaving}>
              <SliderTitle>Up coming<p onClick={incraseUIndex} >다음</p></SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={Uindex}
              >
                {Udata?.results.slice(1).slice(offset * Uindex, offset * Uindex + offset).map((movie) => (
                  <Box
                    key={movie.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    onClick={() => onBoxUClicked(movie.id)}
                    layoutId={movie.id + "u"}
                    bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{movie.title}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigMoveMatch ? (
              <>
                <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                {clickedMovie ?
                  <BigMovie layoutId={bigMoveMatch.params.movieId + "n"}>
                    <BigCover bgPhoto={makeImagePath(clickedMovie.backdrop_path, "w500")} />
                    <BigTitle>{clickedMovie.title}</BigTitle>
                    <BigOverview>개봉 : {clickedMovie.release_date}</BigOverview>
                    <BigOverview>평점 : {clickedMovie.vote_average}</BigOverview>
                    <BigOverview>{clickedMovie.overview}</BigOverview>
                  </BigMovie>
                  :
                  clickedLMovie ? <>
                    <BigMovie layoutId={bigMoveMatch.params.movieId}>
                      <BigCover bgPhoto={makeImagePath(clickedLMovie.backdrop_path, "w500")} />
                      <BigTitle>{clickedLMovie.title}</BigTitle>
                      <BigOverview>개봉 : {clickedLMovie.release_date}</BigOverview>
                      <BigOverview>평점 : {clickedLMovie.vote_average}</BigOverview>
                      <BigOverview>{clickedLMovie.overview}</BigOverview>
                    </BigMovie>
                  </> :
                    clickedTMovie ? <>
                      <BigMovie layoutId={bigMoveMatch.params.movieId + "p"}>
                        <BigCover bgPhoto={makeImagePath(clickedTMovie.backdrop_path, "w500")} />
                        <BigTitle>{clickedTMovie.title}</BigTitle>
                        <BigOverview>개봉 : {clickedTMovie.release_date}</BigOverview>
                        <BigOverview>평점 : {clickedTMovie.vote_average}</BigOverview>
                        <BigOverview>{clickedTMovie.overview}</BigOverview>
                      </BigMovie>
                    </> :
                      clickedUMovie ? <>
                        <BigMovie layoutId={bigMoveMatch.params.movieId + "t"}>
                          <BigCover bgPhoto={makeImagePath(clickedUMovie.backdrop_path, "w500")} />
                          <BigTitle>{clickedUMovie.title}</BigTitle>
                          <BigOverview>개봉 : {clickedUMovie.release_date}</BigOverview>
                          <BigOverview>평점 : {clickedUMovie.vote_average}</BigOverview>
                          <BigOverview>{clickedUMovie.overview}</BigOverview>
                        </BigMovie>
                      </> : null}
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;