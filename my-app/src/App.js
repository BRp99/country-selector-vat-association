import { useState, useRef, useEffect } from "react"

//fonte dos sistemas de identificação para cada país da UE:
//https://www.avalara.com/vatlive/en/eu-vat-rules/eu-vat-number-registration/eu-vat-number-formats.html
//e também por este site para dupla verificação: https://laendercode.net/de/

const europeanCountrys = [
  {
    id: 1,
    nome: "Áustria",
    codigoISOAlpha2: "AT",
    pattern: "U[0-9]{8}",
    exampleVAT: "U12345678",
    descricaoExampleVAT: 'Tem de começar com a letra "U", seguida de 8 dígitos.',
  },
  {
    id: 2,
    nome: "Bélgica",
    codigoISOAlpha2: "BE",
    pattern: "0[0-9]{9}",
    exampleVAT: "0123456789",
    descricaoExampleVAT: 'Tem de começar com "0" e ser seguido por 9 dígitos.',
  },
  {
    id: 3,
    nome: "Bulgária",
    codigoISOAlpha2: "BG",
    pattern: "[0-9]{9,10}",
    exampleVAT: "123456789",
    descricaoExampleVAT: "Pode ter 9 ou 10 dígitos.",
  },
  { id: 4, nome: "Croácia", codigoISOAlpha2: "HR", pattern: "[0-9]{11}", exampleVAT: "12345678901", descricaoExampleVAT: "Tem de ter 11 dígitos." },
  {
    id: 5,
    nome: "Chipre",
    codigoISOAlpha2: "CY",
    pattern: "[0-9]{8}L",
    exampleVAT: "12345678L",
    descricaoExampleVAT: 'Tem de começar com 8 dígitos e terminar com a letra "L".',
  },
  {
    id: 6,
    nome: "República Checa",
    codigoISOAlpha2: "CZ",
    pattern: "[0-9]{8,10}",
    exampleVAT: "12345678",
    descricaoExampleVAT: "Pode ter entre 8 e 10 dígitos.",
  },
  { id: 7, nome: "Dinamarca", codigoISOAlpha2: "DK", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 dígitos." },
  { id: 8, nome: "Eslováquia", codigoISOAlpha2: "SK", pattern: "[0-9]{10}", exampleVAT: "1234567890", descricaoExampleVAT: "Tem de ter 10 dígitos." },
  { id: 9, nome: "Eslovênia", codigoISOAlpha2: "SI", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 dígitos." },
  {
    id: 10,
    nome: "Espanha",
    codigoISOAlpha2: "ES",
    pattern: "[0-9A-Z][0-9]{7}[0-9A-Z]",
    exampleVAT: "X12345678",
    descricaoExampleVAT: "Começa com um caractere alfanumérico, seguido por 7 dígitos e um caractere alfanumérico.",
  },
  { id: 11, nome: "Estónia", codigoISOAlpha2: "EE", pattern: "[0-9]{9}", exampleVAT: "123456789", descricaoExampleVAT: "Tem de ter 9 dígitos." },
  { id: 12, nome: "Finlândia", codigoISOAlpha2: "FI", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 dígitos." },
  {
    id: 13,
    nome: "França",
    codigoISOAlpha2: "FR",
    pattern: "[0-9A-Z]{2}[0-9]{9}",
    exampleVAT: "AB123456789",
    descricaoExampleVAT: "Começa com 2 caracteres alfanuméricos, seguidos de 9 dígitos.",
  },
  { id: 14, nome: "Grécia", codigoISOAlpha2: "GR", pattern: "[0-9]{9}", exampleVAT: "123456789", descricaoExampleVAT: "Tem de ter 9 dígitos." },
  { id: 15, nome: "Hungria", codigoISOAlpha2: "HU", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 dígitos." },
  {
    id: 16,
    nome: "Irlanda",
    codigoISOAlpha2: "IE",
    pattern: "[0-9]S[0-9]{5}L",
    exampleVAT: "1S23456L",
    descricaoExampleVAT: 'Começa com um dígito, seguido pela letra "S", 5 dígitos e termina com a letra "L".',
  },
  { id: 17, nome: "Itália", codigoISOAlpha2: "IT", pattern: "[0-9]{11}", exampleVAT: "12345678901", descricaoExampleVAT: "Tem de ter 11 dígitos." },
  { id: 18, nome: "Letônia", codigoISOAlpha2: "LV", pattern: "[0-9]{11}", exampleVAT: "12345678901", descricaoExampleVAT: "Tem de ter 11 dígitos." },
  {
    id: 19,
    nome: "Lituânia",
    codigoISOAlpha2: "LT",
    pattern: "[0-9]{9}|[0-9]{12}",
    exampleVAT: "123456789",
    descricaoExampleVAT: "Pode ter 9 ou 12 dígitos.",
  },
  { id: 20, nome: "Luxemburgo", codigoISOAlpha2: "LU", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 dígitos." },
  { id: 21, nome: "Malta", codigoISOAlpha2: "MT", pattern: "[0-9]{8}", exampleVAT: "12345678", descricaoExampleVAT: "Tem de ter 8 dígitos." },
  {
    id: 22,
    nome: "Países Baixos",
    codigoISOAlpha2: "NL",
    pattern: "[0-9]{9}B[0-9]{2}",
    exampleVAT: "123456789B01",
    descricaoExampleVAT: 'Começa com 9 dígitos, seguido da letra "B" e 2 dígitos.',
  },
  { id: 23, nome: "Polônia", codigoISOAlpha2: "PL", pattern: "[0-9]{10}", exampleVAT: "1234567890", descricaoExampleVAT: "Tem de ter 10 dígitos." },
  { id: 24, nome: "Portugal", codigoISOAlpha2: "PT", pattern: "[0-9]{9}", exampleVAT: "249888776", descricaoExampleVAT: "Tem de ter 9 dígitos." },
  {
    id: 25,
    nome: "Romênia",
    codigoISOAlpha2: "RO",
    pattern: "[0-9]{2,10}",
    exampleVAT: "1234567890",
    descricaoExampleVAT: "Pode ter entre 2 e 10 dígitos.",
  },
  { id: 26, nome: "Suécia", codigoISOAlpha2: "SE", pattern: "[0-9]{12}", exampleVAT: "123456789012", descricaoExampleVAT: "Tem de ter 12 dígitos." },
  { id: 27, nome: "Alemanha", codigoISOAlpha2: "DE", pattern: "[0-9]{9}", exampleVAT: "123456789", descricaoExampleVAT: "Tem de ter 9 dígitos." },
]

export default function CountrySelector() {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCountries, setFilteredCountries] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [exampleVAT, setExampleVAT] = useState("")
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const normalizedQuery = normalizeString(searchQuery)
    const filtered = europeanCountrys.filter(
      (country) => normalizeString(country.nome).includes(normalizedQuery) || normalizeString(country.codigoISOAlpha2).includes(normalizedQuery)
    )
    setFilteredCountries(filtered)

    //mostro dropdown se houver consulta e se houver resultados filtrados
    setShowDropdown(searchQuery.length > 0)
  }, [searchQuery])

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
  }

  const handleInputChange = (event) => {
    const query = event.target.value
    setSearchQuery(query)
    setHighlightedIndex(-1)

    //limpo seleção de país e exemplo de VAT se o input for modificado e não corresponder ao país selecionado
    if (selectedCountry && query !== `${selectedCountry.codigoISOAlpha2} | ${selectedCountry.nome}`) {
      setSelectedCountry(null)
      setExampleVAT("")
    }

    // 'Croácia' estava a ser diferente de 'Croacia' (sem acento) ou 'croacia'/'croácia' letras maisculas
    const normalizedQuery = normalizeString(query)
    const filtered = europeanCountrys.filter(
      (country) => normalizeString(country.nome).includes(normalizedQuery) || normalizeString(country.codigoISOAlpha2).includes(normalizedQuery)
    )

    setFilteredCountries(filtered)
    //mostro dropdown se houver texto e se houver resultados filtrados
    setShowDropdown(query.length > 0)
  }

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % filteredCountries.length
        scrollToItem(nextIndex)
        return nextIndex
      })
    } else if (event.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => {
        const nextIndex = (prevIndex - 1 + filteredCountries.length) % filteredCountries.length
        scrollToItem(nextIndex)
        return nextIndex
      })
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      handleCountrySelect(filteredCountries[highlightedIndex])
    }
  }

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setSearchQuery(`${country.codigoISOAlpha2} | ${country.nome}`)
    setExampleVAT(country.exampleVAT)
    setShowDropdown(false)
    setHighlightedIndex(-1)
  }

  const scrollToItem = (index) => {
    const dropdownElement = dropdownRef.current
    if (dropdownElement) {
      const itemElement = dropdownElement.children[index]
      if (itemElement) {
        const itemOffsetTop = itemElement.offsetTop
        const itemHeight = itemElement.clientHeight
        const dropdownHeight = dropdownElement.clientHeight

        if (itemOffsetTop < dropdownElement.scrollTop) {
          dropdownElement.scrollTop = itemOffsetTop
        } else if (itemOffsetTop + itemHeight > dropdownElement.scrollTop + dropdownHeight) {
          dropdownElement.scrollTop = itemOffsetTop + itemHeight - dropdownHeight
        }
      }
    }
  }

  const handleFocus = () => {
    setShowDropdown(true)
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement) && !inputRef.current?.contains(document.activeElement)) {
        setShowDropdown(false)
        //se um país estiver selecionado, não limpo o campo de pesquisa
        if (!selectedCountry) {
          setSearchQuery("")
        }
      }
    }, 150)
  }

  const handleMouseDown = (event) => {
    event.preventDefault()
  }

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    inputContainer: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
    },
    countrySelector: {
      position: "relative",
      width: "300px",
    },
    input: {
      width: "100%",
      padding: "10px",
      boxSizing: "border-box",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    dropdown: {
      position: "absolute",
      top: "100%",
      left: "0",
      width: "100%",
      border: "1px solid #ccc",
      borderRadius: "4px",
      backgroundColor: "#fff",
      zIndex: "1000",
      maxHeight: "150px",
      overflowY: "auto",
    },
    dropdownItem: {
      padding: "10px",
      cursor: "pointer",
    },
    dropdownItemHighlighted: {
      backgroundColor: "#f0f0f0",
    },
    noResults: {
      color: "red",
      textAlign: "center",
      padding: "10px",
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <div style={styles.countrySelector}>
          <label className="fs-5 fw-bold mb-2">País</label>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            placeholder="Introduza o país ou código"
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={styles.input}
          />
          {showDropdown && (
            <div style={styles.dropdown} ref={dropdownRef} onMouseDown={handleMouseDown}>
              {filteredCountries.length > 0
                ? filteredCountries.map((country, index) => (
                    <div
                      key={country.id}
                      style={{
                        ...styles.dropdownItem,
                        ...(highlightedIndex === index ? styles.dropdownItemHighlighted : {}),
                      }}
                      onClick={() => handleCountrySelect(country)}
                    >
                      {country.codigoISOAlpha2} | {country.nome}
                    </div>
                  ))
                : //mostro a mensagem apenas se não houver países filtrados e o campo de pesquisa não corresponder ao país selecionado
                  searchQuery.length > 0 && !selectedCountry && <div style={styles.noResults}>Nenhum resultado encontrado</div>}
            </div>
          )}
        </div>
        <div>
          <label className="fs-5 fw-bold mb-2">NIF / VAT</label>
          <input type="text" placeholder={exampleVAT ? `${exampleVAT}` : "Introduza o NIF / VAT"} style={styles.input} disabled />
        </div>
      </div>
    </div>
  )
}
