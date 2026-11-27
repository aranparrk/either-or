from langchain_openai import OpenAIEmbeddings

embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")
vectors = embedding_model.embed_documents(["해운대해수욕장은 부산에 있는 해변입니다."])

print(len(vectors[0]))
print(vectors[0][:5])