import {FC, memo, useRef, useState} from "react";
import Styled from "styled-components";
import {Button, Dropdown, Menu} from "antd";
import usePreventFromInitialRender from "../tools/hooks/usePreventFromInitialRender.hook";
import DATA from "../data.json";
import {DownOutlined} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";

//key 1 for date 2 for name
type actionName = "popular" | "sort" | "newest";
type sort = Record<"key" | "name", string | string>;
type product = Record<"src" | "name" | "price" | "created_date", string | string | string | string>;
interface ProductControllProps {
  onSortChange: (key: string) => any;
  onPopularChange: VoidFunction;
  onNewestChange: VoidFunction;
}

interface ProductProps {
  src: string | undefined;
  price: string;
  name: string;
  created_date: string;
}

interface ProductButtonProps {
  label: string;
  onChange: (val?: string) => any;
}

interface ProductDropDownProps extends ProductButtonProps {
  options: {
    key: string;
    label: string;
  }[];
}

const StyledProductContainer = Styled.div`
  margin : 0 auto;
  border-radius : 10px;
  border : 1px solid var(--white);
  background-color : var(--lightGray);
  width : 50vw;
  padding : 20px;
`;

const StyledDropDownContainer = Styled.div`
  border : 1px solid var(--white);
  border-radius : 10px;
  padding : 10px;
  background-color : var(--white);
  width : 140px;
`;

const StyledButtonContainer = Styled.div`
  text-align : right;
  display : flex;
  flex-direction : column;
`;

const StyledButton = Styled(Button)`
border-radius : 10px;
height : 40px;
`;

const StyledProduct = Styled.div`
  width : 300px;
  max-height : 300px;
  min-height : 50px;
  border : 1px solid var(--white);
  margin : 10px;
  border-radius : 10px;
  padding : 10px;
`;

const StyledProductResult = Styled.div`
  height : 80vh;
`;
const ProductDropDown: FC<ProductDropDownProps> = ({label, onChange, options}) => {
  const [selected, setSelected] = useState<("name" | "date") | undefined>(undefined);
  const handleSelect = (key: string) => {
    onChange(key);
    setSelected(key === "1" ? "date" : "name");
  };
  const OptionsMenu = <Menu onClick={({key}) => handleSelect(key)} items={options} />;
  return (
    <StyledButtonContainer>
      <span className="w-auto mb-2"> {label} </span>
      <StyledDropDownContainer>
        <Dropdown overlay={OptionsMenu} placement="bottom" className="w-100">
          <div className="flex items-center">
            <DownOutlined />
            <div className="ml-2">{selected || "Select Option"}</div>
          </div>
        </Dropdown>
      </StyledDropDownContainer>
    </StyledButtonContainer>
  );
};

const ProductButton: FC<ProductButtonProps> = ({label, onChange}) => (
  <StyledButtonContainer>
    <StyledButton onClick={() => onChange()}>{label}</StyledButton>
  </StyledButtonContainer>
);
export default function Products() {
  const [data, setData] = useState<any[]>([]);
  const [showPopular, setShowPopular] = useState(false);
  const [newest, setNewest] = useState(false);
  const [sort, setSort] = useState<sort | undefined>(undefined);
  const maxCountPerLoad = useRef(DATA.result.products);
  const handleChangePopular = () => {
    setShowPopular(prev => !prev);
  };
  const handleChangeNewest = () => {
    setNewest(prev => !prev);
  };
  const handleChangeSort = (key: string) => {
    setSort(() => {
      if (key === "1") return {name: "date", key};
      else return {name: "name", key};
    });
  };

  const handleUpdatePopular = () => {
    setData(
      DATA.result.products
        .filter(item => item.product_type !== "simple")
        .map(item => ({
          src: item.static_url ? item.url : undefined,
          name: item.name,
          price: item.product_variants[0]?.price.toString() || "0",
          created_date: item.created_at,
        }))
    );
  };
  const handleRemovePopular = () => {
    setData(prev => prev.filter(item => item.product_type === "simple"));
  };
  const handleUpdateNewest = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    setData(
      DATA.result.products
        .filter(item => {
          const createdAtYear = new Date(item.created_at).getFullYear();
          const createdAtMonth = new Date(item.created_at).getMonth();
          return (
            createdAtYear === currentYear && (createdAtMonth === currentMonth || createdAtMonth + 1 === currentMonth)
          );
        })
        .map(item => ({
          src: item.static_url ? item.url : undefined,
          name: item.name,
          price: item.product_variants[0]?.price.toString() || "0",
          created_date: item.created_at,
        }))
    );
  };
  const handleRemoveNewest = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    setData(
      DATA.result.products.filter(item => {
        const createdAtYear = new Date(item.created_at).getFullYear();
        const createdAtMonth = new Date(item.created_at).getMonth();
        return !(
          createdAtYear === currentYear &&
          (createdAtMonth === currentMonth || createdAtMonth + 1 === currentMonth)
        );
      })
    );
  };
  const handleUpdateSort = () => {
    //key 1 for date 2 for name

    if (sort?.key === "1") {
      DATA.result.products
        .sort((a, b) => {
          const dayA = new Date(a.created_at).getDate();
          const dayB = new Date(b.created_at).getDate();
          const monthA = new Date(a.created_at).getMonth();
          const monthB = new Date(b.created_at).getMonth();
          const yearA = new Date(a.created_at).getMonth();
          const yearB = new Date(b.created_at).getMonth();

          if (yearA === yearB) {
            if (monthA === monthB) {
              return dayA - dayB;
            } else {
              return monthA - monthB;
            }
          } else {
            return yearA - yearB;
          }
        })
        .map(item => ({
          src: item.static_url ? item.url : undefined,
          name: item.name,
          price: item.product_variants[0]?.price.toString() || "0",
          created_date: item.created_at,
        }));
    } else if (sort?.key === "2") {
      DATA.result.products
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(item => ({
          src: item.static_url ? item.url : undefined,
          name: item.name,
          price: item.product_variants[0]?.price.toString() || "0",
          created_date: item.created_at,
        }));
    }
  };
  const urlPushState = (key: actionName) => {
    window.history.pushState("", "", key !== "sort" ? `/products?${key}=true` : `/products?${key}=${sort?.name}`);
  };
  const removePushState = (key: actionName) => {
    window.history.replaceState(
      "",
      "",
      window.location.pathname.replace(key === "sort" ? `${key}=true` : `${key}=${sort?.name}`, "")
    );
  };
  const handleLoadNext = () => {
    const perLoad = 33;
  };

  usePreventFromInitialRender(() => {
    if (showPopular) {
      urlPushState("popular");
      handleUpdatePopular();
    } else {
      removePushState("popular");
      handleRemovePopular();
    }
  }, [showPopular]);
  usePreventFromInitialRender(() => {
    if (newest) {
      urlPushState("newest");
      handleUpdateNewest();
    } else {
      removePushState("newest");
      handleRemoveNewest();
    }
  }, [newest]);
  usePreventFromInitialRender(() => {
    if (sort) {
      urlPushState("sort");
      handleUpdateSort();
    } else {
      removePushState("sort");
    }
  }, [sort]);

  return (
    <StyledProductContainer>
      <ProductsControll
        onSortChange={handleChangeSort}
        onPopularChange={handleChangePopular}
        onNewestChange={handleChangeNewest}
      />
      <ProductResult data={data} />
    </StyledProductContainer>
  );
}

const ProductsControll: FC<ProductControllProps> = memo(props => {
  const {onNewestChange, onPopularChange, onSortChange} = props;
  const sortOption = [
    {key: "1", label: "date"},
    {key: "2", label: "name"},
  ];
  return (
    <div className="flex items-center justify-between w-100">
      <ProductDropDown options={sortOption} label="Sort" onChange={val => onSortChange(val as string)} />
      <ProductButton label="Popular" onChange={onPopularChange} />
      <ProductButton label="Newest" onChange={onNewestChange} />
    </div>
  );
});

const ProductResult: FC<{data: product[]}> = ({data}) => (
  <StyledProductResult className="flex wrap">
    <InfiniteScroll
      dataLength={DATA.result.products.length}
      loader={<h4>Loading...</h4>}
      next={fetchData}
      hasMore={true}
      endMessage={
        <p style={{textAlign: "center"}}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {data.map(item => (
        <Product created_date={item.created_date} src={item.src} name={item.name} price={item.price} />
      ))}
    </InfiniteScroll>
  </StyledProductResult>
);

const Product: FC<ProductProps> = ({name, price, src, created_date}) => (
  <StyledProduct className="flex column">
    {src && <img src={src} alt={name} width="100%" height="60%" />}

    <div className="flex column mt-2">
      <span className="mb-2">{name}</span>
      <div className="flex items-center justify-between">
        <span className="font-sm text-darkGray">{created_date}</span>
        <span className="font-sm text-darkGray">{price}</span>
      </div>
    </div>
  </StyledProduct>
);
