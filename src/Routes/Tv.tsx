import { useQuery } from "react-query";
import { IGetMoviesResult, IGetTvResult, geAiringTv, getLastestMovies, getLatestTv, getMovies, getPopularTv, getTopMovies, getTopTv, getTv } from "../api";
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

function Tv() {
  const navigate = useNavigate();
  const bigTvMatch: PathMatch<string> | null = useMatch("/tvs/:tvId");
  const { data, isLoading } = useQuery<IGetTvResult>(["tv", "newPlaying"], getTv);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalTvs = data.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tvs/${tvId}`);
  };
  const onOverlayClick = () => navigate(-1);
  const clickedTv = bigTvMatch?.params.tvId && data?.results.find(tv => tv.id + "" === bigTvMatch.params.tvId);

  //geAiringTv
  const { data: Adata, isLoading: isALoading } = useQuery<IGetTvResult>(["tv", "airing_today"], geAiringTv);
  const [aindex, setAIndex] = useState(0);
  const [aleaving, setALeaving] = useState(false);
  const incraseAIndex = () => {
    if (Adata) {
      if (aleaving) return;
      setALeaving(true);
      const totalTvs = Adata.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setAIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleALeaving = () => setALeaving((prev) => !prev);
  const onBoxAClicked = (tvId: number) => {
    navigate(`/tvs/${tvId}`);
  };  
  const clickedATv = bigTvMatch?.params.tvId && Adata?.results.find(tv => tv.id + "" === bigTvMatch.params.tvId);

  //getPopularTv
  const { data: Pdata, isLoading: isPLoading } = useQuery<IGetTvResult>(["tv", "popular"], getPopularTv);
  const [pindex, setPIndex] = useState(0);
  const [pleaving, setPLeaving] = useState(false);
  const incrasePIndex = () => {
    if (Pdata) {
      if (pleaving) return;
      setPLeaving(true);
      const totalTvs = Pdata.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setPIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const togglePLeaving = () => setPLeaving((prev) => !prev);
  const onBoxPClicked = (tvId: number) => {
    navigate(`/tvs/${tvId}`);
  };
  
  const clickedPTv = bigTvMatch?.params.tvId && Pdata?.results.find(tv => tv.id + "" === bigTvMatch.params.tvId);

  //getTopTv
  const { data: Tdata, isLoading: isTLoading } = useQuery<IGetTvResult>(["tv", "top_rated"], getTopTv);
  const [tindex, setTIndex] = useState(0);
  const [Tleaving, setTLeaving] = useState(false);
  const incraseTIndex = () => {
    if (Tdata) {
      if (Tleaving) return;
      setTLeaving(true);
      const totalTvs = Tdata.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setTIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleTLeaving = () => setTLeaving((prev) => !prev);
  const onBoxTClicked = (tvId: number) => {
    navigate(`/tvs/${tvId}`);
  };
  
  const clickedTTv = bigTvMatch?.params.tvId && Tdata?.results.find(tv => tv.id + "" === bigTvMatch.params.tvId);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>
              {data?.results[0].name}
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
              <SliderTitle>On the air<p onClick={incraseIndex} >다음</p></SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results.slice(1).slice(offset * index, offset * index + offset).map((tv) => (
                  <Box
                    key={tv.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    onClick={() => onBoxClicked(tv.id)}
                    layoutId={tv.id + "o"}
                    bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{tv.name}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>




          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleALeaving}>
              <SliderTitle>Airing today<p onClick={incraseAIndex} >다음</p></SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={aindex}
              >
                {Adata?.results.slice(1).slice(offset * aindex, offset * aindex + offset).map((tv) => (
                  <Box
                    key={tv.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    onClick={() => onBoxAClicked(tv.id)}
                    layoutId={tv.id + "a"}
                    bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{tv.name}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <Slider>
            <AnimatePresence initial={false} onExitComplete={togglePLeaving}>
              <SliderTitle>Popular<p onClick={incrasePIndex} >다음</p></SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={pindex}
              >
                {Pdata?.results.slice(1).slice(offset * pindex, offset * pindex + offset).map((tv) => (
                  <Box
                    key={tv.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    onClick={() => onBoxPClicked(tv.id)}
                    layoutId={tv.id + "p"}
                    bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{tv.name}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleTLeaving}>
              <SliderTitle>Top rated<p onClick={incraseTIndex} >다음</p></SliderTitle>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={tindex}
              >
                {Tdata?.results.slice(1).slice(offset * tindex, offset * tindex + offset).map((tv) => (
                  <Box
                    key={tv.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    onClick={() => onBoxTClicked(tv.id)}
                    layoutId={tv.id + "t"}
                    bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{tv.name}</h4>
                    </Info>
                  </Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                {clickedTv ?
                  <BigMovie layoutId={bigTvMatch.params.tvId + "o"}>
                    <BigCover bgPhoto={makeImagePath(clickedTv.backdrop_path, "w500")} />
                    <BigTitle>{clickedTv.name}</BigTitle>
                    <BigOverview>개봉 : {clickedTv.first_air_date}</BigOverview>
                    <BigOverview>평점 : {clickedTv.vote_average}</BigOverview>
                    <BigOverview>{clickedTv.overview}</BigOverview>
                  </BigMovie>
                  :
                  clickedATv ? <>
                    <BigMovie layoutId={bigTvMatch.params.tvId + "a"}>
                      <BigCover bgPhoto={makeImagePath(clickedATv.backdrop_path, "w500")} />
                      <BigTitle>{clickedATv.name}</BigTitle>
                      <BigOverview>개봉 : {clickedATv.first_air_date}</BigOverview>
                      <BigOverview>평점 : {clickedATv.vote_average}</BigOverview>
                      <BigOverview>{clickedATv.overview}</BigOverview>
                    </BigMovie>
                  </> :
                    clickedPTv ? <>
                      <BigMovie layoutId={bigTvMatch.params.tvId + "p"}>
                        <BigCover bgPhoto={makeImagePath(clickedPTv.backdrop_path, "w500")} />
                        <BigTitle>{clickedPTv.name}</BigTitle>
                        <BigOverview>개봉 : {clickedPTv.first_air_date}</BigOverview>
                        <BigOverview>평점 : {clickedPTv.vote_average}</BigOverview>
                        <BigOverview>{clickedPTv.overview}</BigOverview>
                      </BigMovie>
                    </> :
                      clickedTTv ? <>
                        <BigMovie layoutId={bigTvMatch.params.tvId + "t"}>
                          <BigCover bgPhoto={makeImagePath(clickedTTv.backdrop_path, "w500")} />
                          <BigTitle>{clickedTTv.name}</BigTitle>
                          <BigOverview>개봉 : {clickedTTv.first_air_date}</BigOverview>
                          <BigOverview>평점 : {clickedTTv.vote_average}</BigOverview>
                          <BigOverview>{clickedTTv.overview}</BigOverview>
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
export default Tv;