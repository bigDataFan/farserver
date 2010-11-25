package net.gqu.jscript.root;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.gqu.exception.HttpStatusExceptionImpl;
import net.gqu.utils.RhinoUtils;

import org.bson.types.ObjectId;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoException;
import com.mongodb.WriteConcern;
import com.mongodb.WriteResult;

public class ScriptMongoDBCollection {

	private  DBCollection coll;
	
	public String insert(NativeObject no) throws MongoException {
		Map<String, Object> map = RhinoUtils.nativeObjectToMap(no);
		BasicDBObject bo = new BasicDBObject(map);
		WriteResult wr = coll.insert(bo, WriteConcern.SAFE);
		return bo.getString("_id");
	}
	
	public Object[] distinct(String key) {
		List<Object> list = coll.distinct(key);
		return list.toArray(new Object[list.size()]);
	}
	
	public Object[] distinct(String key, NativeObject n) {
		Map<String, Object> newMap = RhinoUtils.nativeObjectToMap(n);
		List list = coll.distinct(key, new BasicDBObject(newMap));
		return list.toArray(new Object[list.size()]);
	}
	
	public String upsert(NativeObject o, NativeObject n) throws MongoException {
		Map<String, Object> oldMap = RhinoUtils.nativeObjectToMap(o);
		Map<String, Object> newMap = RhinoUtils.nativeObjectToMap(n);
		
		BasicDBObject newobj = new BasicDBObject(newMap);
		if (oldMap.get("id")!=null && !oldMap.get("id").equals("")) {//update with exsiting id
			try {
				BasicDBObject query = new BasicDBObject("_id", new ObjectId((String)oldMap.get("id")));
				WriteResult wr = coll.update(query, newobj, true, false);
				return  (String)oldMap.get("id");
			} catch (Exception e) {
				return "error";
			}
		} else { //update with query
			WriteResult wr = coll.update(new BasicDBObject(oldMap), newobj, true, false);
			if ((Boolean)wr.getField("updatedExisting")) {
				DBObject one = coll.findOne(new BasicDBObject(oldMap));
				return one.get("_id").toString();
			} else {
				return wr.toString();
			}
		}
		
	}
	
	public void incField(String id, String field, Long incs) {

		BasicDBObject inc = new BasicDBObject();
		Map<String, Long> zz = new HashMap<String, Long>();
		zz.put(field, incs);
		inc.put("$inc", zz);
		
		BasicDBObject query = new BasicDBObject();
		query.put("_id", new ObjectId(id));	
		
		coll.update(query, inc);
	}
	
	public String upsert(NativeObject o) throws MongoException {
		Map<String, Object> oldMap = RhinoUtils.nativeObjectToMap(o);
		
		WriteResult wr; 
		if (oldMap.get("id")!=null && !oldMap.get("id").equals("")) {
			try {
				DBObject query = new BasicDBObject();
				query.put("_id", new ObjectId((String)oldMap.get("id")));
				oldMap.remove("id");
				wr = coll.update(query, new BasicDBObject(oldMap), true, false);
				if (wr.getField("updatedExisting")!=null) {
					if ((Boolean)wr.getField("updatedExisting")) {
						DBObject one = coll.findOne(new BasicDBObject(oldMap));
						return one.get("_id").toString();
					}
				}
				Object upserted = wr.getField("upserted");
				return upserted.toString();
				
			}  catch (Exception e) {
				return null;
			}
		} else {
			wr = coll.insert(new BasicDBObject(oldMap), WriteConcern.SAFE);
			return wr.getError();
		}
	}

	public void save(NativeObject o) {
		Map<String, Object> oldMap = RhinoUtils.nativeObjectToMap(o);
		coll.save(new BasicDBObject(oldMap));
	}
	
	public NativeObject getById(String id) {
		if (id=="undefined") {
			return null;
		}
		DBObject dbo = new BasicDBObject();
		try {
			dbo.put("_id", new ObjectId(id));	
			DBObject result = coll.findOne(dbo);
			if(result!=null) {
				return RhinoUtils.mapToNativeObject(result.toMap());
			} 
		} catch (Exception e) {
		}
		return null;
	}
	
	public NativeObject findOne(NativeObject o) {
		Map<String, Object> oldMap = RhinoUtils.nativeObjectToMap(o);
		DBObject one = coll.findOne(new BasicDBObject(oldMap));
		if (one==null) {
			return null;
		} else {
			return RhinoUtils.mapToNativeObject(one.toMap());
		}
	}
	
	public void remove(NativeObject o)throws MongoException {
		Map<String, Object> oldMap = RhinoUtils.nativeObjectToMap(o);

		if (oldMap.get("id")!=null) {
			oldMap.put("_id", new ObjectId((String)oldMap.get("id")));
			oldMap.remove("id");
		}
		coll.remove(new BasicDBObject(oldMap));
	}
	
	public ScriptDBCursor find(NativeObject o) {
		Map<String, Object> oldMap = RhinoUtils.nativeObjectToMap(o);
		BasicDBObject bdo = new BasicDBObject();
		
		return new ScriptDBCursor(coll.find(new BasicDBObject(oldMap)));
	}
	
	public ScriptDBCursor find(NativeObject o, NativeObject keys) {
		Map<String, Object> oldMap = RhinoUtils.nativeObjectToMap(o);
		Map<String, Object> keysMap = RhinoUtils.nativeObjectToMap(keys);
		BasicDBObject bdo = new BasicDBObject();
		return new ScriptDBCursor(coll.find(new BasicDBObject(oldMap),new BasicDBObject(keysMap)));
	}
	
	
	
	
	public ScriptDBCursor findRecent(NativeObject o) {
		Map<String, Object> oldMap = new HashMap<String, Object>();
		if (o!=null) {
			oldMap = RhinoUtils.nativeObjectToMap(o);
		}
		
		DBObject orders = new BasicDBObject();
		orders.put("$natural", -1);
		DBCursor finded = coll.find(new BasicDBObject(oldMap)).sort(orders);
		
		return new ScriptDBCursor(finded);
	}
	
	public ScriptDBCursor findRecent() {
		
		DBObject orders = new BasicDBObject();
		orders.put("$natural", -1);
		DBCursor finded = coll.find().sort(orders);
		
		return new ScriptDBCursor(finded);
	}
	
	
	
	public WriteResult insert(NativeArray na) throws MongoException {
		Object[] nas = RhinoUtils.nativeArrayToArray(na);
		DBObject[] dbos = new DBObject[nas.length];
		for (int i = 0; i < nas.length; i++) {
			if (nas[i] instanceof NativeObject) {
				dbos[i] = new BasicDBObject(RhinoUtils.nativeObjectToMap((NativeObject)nas[i]));
			} else {
				throw new HttpStatusExceptionImpl(400, "you can only insert a array of object");
			}
		}
		return coll.insert(dbos, WriteConcern.SAFE);
	}
	
	public ScriptMongoDBCollection(DBCollection coll) {
		super();
		this.coll = coll;
	}

	public final Object apply(DBObject jo, boolean ensureID) {
		return coll.apply(jo, ensureID);
	}

	public final Object apply(DBObject o) {
		return coll.apply(o);
	}

	public long count() throws MongoException {
		return coll.count();
	}

	public long count(DBObject query) throws MongoException {
		return coll.count(query);
	}

	public void createIndex(DBObject arg0, DBObject arg1) throws MongoException {
		coll.createIndex(arg0, arg1);
	}

	public final void createIndex(DBObject keys) throws MongoException {
		coll.createIndex(keys);
	}

	public DBObject findAndModify(DBObject query, DBObject fields,
			DBObject sort, boolean remove, DBObject update, boolean returnNew,
			boolean upsert) {
		return coll.findAndModify(query, fields, sort, remove, update,
				returnNew, upsert);
	}

	public DBObject findAndModify(DBObject query, DBObject sort, DBObject update) {
		return coll.findAndModify(query, sort, update);
	}

	public DBObject findAndRemove(DBObject query) {
		return coll.findAndRemove(query);
	}

	public DBCollection getCollection(String n) {
		return coll.getCollection(n);
	}

	public long getCount() throws MongoException {
		return coll.getCount();
	}

	public long getCount(DBObject arg0, DBObject arg1, long arg2, long arg3)
			throws MongoException {
		return coll.getCount(arg0, arg1, arg2, arg3);
	}

	public long getCount(DBObject query, DBObject fields) throws MongoException {
		return coll.getCount(query, fields);
	}

	public long getCount(DBObject query) throws MongoException {
		return coll.getCount(query);
	}

	public DBObject group(DBObject key, DBObject cond, DBObject initial,
			String reduce) throws MongoException {
		return coll.group(key, cond, initial, reduce);
	}

	public DBCollection rename(String newName) throws MongoException {
		return coll.rename(newName);
	}

	
/*
	private DBObject[] convert(NativeArray na) {
		Object[] propIds = na.getIds();
		DBObject[] result = new DBObject[propIds.length];
		for (int i=0; i<propIds.length; i++) {
			Object propId = propIds[i];
			Object value = na.get(propId.toString(), na);
			if (value instanceof NativeObject) {
				result[i] = convert((NativeObject)value);
			} else  {
				throw new HttpStatusExceptionImpl(400, "bad converted object " +result[i]);
			}
		}
		return result;
	}
	    

	private DBObject convert(NativeObject no) {
		BasicDBObject bdo = new BasicDBObject();
		Object[] ids = no.getIds();
		for (Object id : ids) {
		    	String key = id.toString();
		    	Object value = no.get(key, no);
		    	bdo.append(key, nativeToObject(value));
		}
		return bdo;
	}
*/
	
    /**
     * Look at the id's of a native array and try to determine whether it's actually an Array or a HashMap
     * 
     * @param ids       id's of the native array
     * @return boolean  true if it's an array, false otherwise (ie it's a map)
     */
    private static boolean isArray(Object[] ids)
    {
        boolean result = true;
        for (Object id : ids)
        {
            if (id instanceof Integer == false)
            {
               result = false;
               break;
            }
        }
        return result;
    }
    
}
